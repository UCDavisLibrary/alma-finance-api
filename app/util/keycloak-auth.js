import crypto from 'crypto';
import express from 'express';
import config from './config.js';
import { logMessage } from './logger.js';

const SESSION_KEY = 'keycloak';
const LOGIN_SESSION_KEY = 'keycloakLogin';
const CLOCK_TOLERANCE_SECONDS = 60;
const JWKS_CACHE_MS = 5 * 60 * 1000;

let jwksCache = {
  expiresAt: 0,
  keys: [],
};

function keycloakConfig() {
  const { keycloak } = config;
  const missing = [];
  if (!keycloak.issuerUrl) missing.push('KEYCLOAK_ISSUER_URL');
  if (!keycloak.clientId) missing.push('KEYCLOAK_CLIENT_ID');
  if (!keycloak.redirectUri) missing.push('KEYCLOAK_REDIRECT_URI or APP_URL');

  if (missing.length) {
    throw new Error(`Missing Keycloak configuration: ${missing.join(', ')}`);
  }

  return keycloak;
}

function endpoint(path) {
  return `${keycloakConfig().issuerUrl}/protocol/openid-connect/${path}`;
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return Buffer.from(padded, 'base64');
}

function decodeJwtPart(input) {
  return JSON.parse(base64UrlDecode(input).toString('utf8'));
}

function parseJwt(token) {
  const parts = token?.split('.');
  if (parts?.length !== 3) throw new Error('Invalid JWT');
  return {
    header: decodeJwtPart(parts[0]),
    payload: decodeJwtPart(parts[1]),
    signingInput: `${parts[0]}.${parts[1]}`,
    signature: base64UrlDecode(parts[2]),
  };
}

async function fetchJwks() {
  if (jwksCache.expiresAt > Date.now()) return jwksCache.keys;

  const response = await fetch(endpoint('certs'));
  if (!response.ok) throw new Error(`Unable to fetch Keycloak JWKS: HTTP ${response.status}`);

  const body = await response.json();
  jwksCache = {
    expiresAt: Date.now() + JWKS_CACHE_MS,
    keys: body.keys || [],
  };
  return jwksCache.keys;
}

async function verifyJwtSignature(parsedJwt) {
  const { header, signingInput, signature } = parsedJwt;
  const algorithm = {
    RS256: 'RSA-SHA256',
    RS384: 'RSA-SHA384',
    RS512: 'RSA-SHA512',
  }[header.alg];

  if (!algorithm) throw new Error(`Unsupported JWT algorithm: ${header.alg}`);

  const keys = await fetchJwks();
  const jwk = keys.find((key) => key.kid === header.kid) || keys.find((key) => key.kty === 'RSA');
  if (!jwk) throw new Error('Unable to find matching Keycloak signing key');

  const key = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const verified = crypto.verify(algorithm, Buffer.from(signingInput), key, signature);
  if (!verified) throw new Error('Invalid Keycloak JWT signature');
}

async function verifyJwt(token, { audience, nonce } = {}) {
  const parsed = parseJwt(token);
  await verifyJwtSignature(parsed);

  const { payload } = parsed;
  const now = Math.floor(Date.now() / 1000);

  if (payload.iss !== keycloakConfig().issuerUrl) throw new Error('Invalid Keycloak issuer');
  if (payload.exp && payload.exp + CLOCK_TOLERANCE_SECONDS < now) throw new Error('Expired Keycloak token');
  if (payload.nbf && payload.nbf - CLOCK_TOLERANCE_SECONDS > now) throw new Error('Keycloak token is not active yet');

  if (audience) {
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(audience)) throw new Error('Invalid Keycloak token audience');
  }

  if (nonce && payload.nonce !== nonce) throw new Error('Invalid Keycloak nonce');

  return payload;
}

function splitValues(value) {
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function collectRoles(...claimSets) {
  const roles = new Set();
  const groups = new Set();

  for (const claims of claimSets.filter(Boolean)) {
    for (const role of claims.realm_access?.roles || []) roles.add(role);

    for (const resource of Object.values(claims.resource_access || {})) {
      for (const role of resource.roles || []) roles.add(role);
    }

    for (const group of claims.groups || []) groups.add(group);
  }

  return {
    roles: [...roles],
    groups: [...groups],
  };
}

function getClaim(claims, path) {
  if (!claims || !path) return undefined;
  return path.split('.').reduce((value, part) => value?.[part], claims);
}

function firstValue(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function deriveLibrary(idClaims, accessClaims, roles, groups) {
  const { libraryClaim, libraryRolePrefix, libraryGroupPrefix, defaultLibrary } = keycloakConfig();
  const claimLibrary = firstValue(getClaim(accessClaims, libraryClaim)) || firstValue(getClaim(idClaims, libraryClaim));
  if (claimLibrary) return String(claimLibrary).toUpperCase();

  const roleLibrary = roles.find((role) => role.startsWith(libraryRolePrefix));
  if (roleLibrary) return roleLibrary.slice(libraryRolePrefix.length).toUpperCase();

  const groupLibrary = groups.find((group) => group.startsWith(libraryGroupPrefix));
  if (groupLibrary) return groupLibrary.slice(libraryGroupPrefix.length).replace(/^\/+/, '').toUpperCase();

  return defaultLibrary || null;
}

function hasAnyPermission(user, permissions) {
  const permissionSet = new Set([...(user?.roles || []), ...(user?.groups || [])]);
  return permissions.some((permission) => permissionSet.has(permission));
}

function normalizeLibrary(library) {
  return String(library || '').trim().toUpperCase();
}

function allowedLibrariesForUser(user) {
  if (!user) return [];
  if (user.isAdmin) return keycloakConfig().libraryOptions.map(normalizeLibrary);
  return user.library ? [normalizeLibrary(user.library)] : [];
}

function sessionUser(req) {
  const authSession = req.session?.[SESSION_KEY];
  if (!authSession?.user) return null;

  const user = authSession.user;
  const availableLibraries = allowedLibrariesForUser(user);
  const selectedLibrary = normalizeLibrary(authSession.selectedLibrary);
  const activeLibrary = availableLibraries.includes(selectedLibrary)
    ? selectedLibrary
    : normalizeLibrary(user.library);

  return {
    ...user,
    library: activeLibrary || null,
    homeLibrary: user.library || null,
    availableLibraries,
  };
}

function buildUser(idClaims, accessClaims) {
  const { adminRole } = keycloakConfig();
  const { roles, groups } = collectRoles(idClaims, accessClaims);
  const id = idClaims.preferred_username || accessClaims?.preferred_username || idClaims.email || idClaims.sub;
  const firstname = idClaims.given_name || accessClaims?.given_name || '';
  const lastname = idClaims.family_name || accessClaims?.family_name || '';
  const fullName = idClaims.name || accessClaims?.name || id;

  const user = {
    id,
    kerberos: id,
    firstname: firstname || fullName,
    lastname,
    email: idClaims.email || accessClaims?.email || '',
    library: deriveLibrary(idClaims, accessClaims, roles, groups),
    roles,
    groups,
  };

  user.isAdmin = hasAnyPermission(user, [adminRole]);
  return user;
}

function authUrl(req) {
  const state = base64UrlEncode(crypto.randomBytes(32));
  const nonce = base64UrlEncode(crypto.randomBytes(32));
  const codeVerifier = base64UrlEncode(crypto.randomBytes(32));
  const codeChallenge = base64UrlEncode(crypto.createHash('sha256').update(codeVerifier).digest());
  const returnTo = safeReturnTo(req.query.returnTo || req.originalUrl || '/');

  req.session[LOGIN_SESSION_KEY] = {
    state,
    nonce,
    codeVerifier,
    returnTo,
  };

  const url = new URL(endpoint('auth'));
  url.searchParams.set('client_id', keycloakConfig().clientId);
  url.searchParams.set('redirect_uri', keycloakConfig().redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  return url.toString();
}

async function exchangeCodeForTokens(code, codeVerifier) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: keycloakConfig().clientId,
    code,
    redirect_uri: keycloakConfig().redirectUri,
    code_verifier: codeVerifier,
  });

  if (keycloakConfig().clientSecret) {
    body.set('client_secret', keycloakConfig().clientSecret);
  }

  const response = await fetch(endpoint('token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Keycloak token exchange failed: ${data.error_description || data.error || response.status}`);
  }

  return data;
}

function safeReturnTo(returnTo) {
  if (typeof returnTo !== 'string' || !returnTo.startsWith('/')) return '/';
  if (returnTo.startsWith('//')) return '/';
  if (returnTo.startsWith('/auth/')) return '/';
  return returnTo;
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

function destroySession(req) {
  return new Promise((resolve) => {
    req.session.destroy(() => resolve());
  });
}

function keycloakLogoutUrl(idToken) {
  const redirectUri = keycloakConfig().logoutRedirectUri || '/';
  const url = new URL(endpoint('logout'));
  url.searchParams.set('client_id', keycloakConfig().clientId);
  url.searchParams.set('post_logout_redirect_uri', redirectUri);
  if (idToken) url.searchParams.set('id_token_hint', idToken);
  return url.toString();
}

export function attachUser(req, res, next) {
  const user = sessionUser(req);
  if (user) {
    res.locals.userdata = user;
    res.locals.isAdmin = !!user.isAdmin;
  }
  next();
}

export function requireAuth({ api = false } = {}) {
  return (req, res, next) => {
    if (sessionUser(req)) return next();

    if (api) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.redirect(`/auth/login?returnTo=${encodeURIComponent(req.originalUrl || '/')}`);
  };
}

export function requireAdmin(req, res, next) {
  const user = sessionUser(req);
  if (user?.isAdmin) return next();
  return res.status(403).json({ error: 'Forbidden' });
}

export function setActiveLibrary(req, library) {
  const authSession = req.session?.[SESSION_KEY];
  const user = sessionUser(req);
  if (!authSession || !user) return { status: 401, error: 'Unauthorized' };
  if (!user.isAdmin) return { status: 403, error: 'Only admins can switch library context' };

  const nextLibrary = normalizeLibrary(library);
  if (!user.availableLibraries.includes(nextLibrary)) {
    return { status: 400, error: 'Invalid library' };
  }

  authSession.selectedLibrary = nextLibrary;
  return {
    status: 200,
    user: sessionUser(req),
  };
}

export const authRouter = express.Router();

authRouter.get('/auth/login', (req, res, next) => {
  try {
    res.redirect(authUrl(req));
  } catch (error) {
    next(error);
  }
});

authRouter.get('/auth/callback', async (req, res, next) => {
  try {
    const login = req.session?.[LOGIN_SESSION_KEY];
    if (!login || req.query.state !== login.state) {
      return res.status(400).send('Invalid login state');
    }
    if (!req.query.code) {
      return res.status(400).send('Missing authorization code');
    }

    const tokens = await exchangeCodeForTokens(req.query.code, login.codeVerifier);
    const idClaims = await verifyJwt(tokens.id_token, {
      audience: keycloakConfig().clientId,
      nonce: login.nonce,
    });
    const accessClaims = tokens.access_token ? await verifyJwt(tokens.access_token) : null;
    const user = buildUser(idClaims, accessClaims);

    const requiredRoles = splitValues(keycloakConfig().requiredRole);
    if (requiredRoles.length && !hasAnyPermission(user, requiredRoles)) {
      return res.status(403).send('You do not have access to this application.');
    }

    const returnTo = login.returnTo;
    await regenerateSession(req);
    req.session[SESSION_KEY] = {
      idToken: tokens.id_token,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      user,
    };

    res.redirect(returnTo);
  } catch (error) {
    logMessage('DEBUG', 'keycloak-auth: callback()', error.message);
    next(error);
  }
});

authRouter.get('/auth/logout', async (req, res, next) => {
  try {
    const idToken = req.session?.[SESSION_KEY]?.idToken;
    const logoutUrl = idToken ? keycloakLogoutUrl(idToken) : (keycloakConfig().logoutRedirectUri || '/');
    await destroySession(req);
    res.redirect(logoutUrl);
  } catch (error) {
    next(error);
  }
});
