import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key, defaultValue) => process.env[key] ?? defaultValue;
const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');
const getListEnv = (key, defaultValue) => getEnv(key, defaultValue)
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

class Config {
  constructor() {
    this.app = {
      port: getEnv('PORT', 5000),
      url: getEnv('APP_URL'),
      session: getEnv('EXPRESS_SESSION'),
      isLocal: getEnv('IS_LOCAL', 'true') === 'true',
      title: 'Alma Payment Processor',
      bundleName: 'alma-finance.js',
      stylesheetName: 'alma-finance.css',
      // Routes WITHOUT leading slash — spa-router-middleware and globalOnClick both prepend '/'
      routes: [
        'preview',
        'invoice',
        'paid',
        'search',
        'unpaid',
        'admin',
        'funds',
        'vendors',
      ],
    };

    this.keycloak = {
      issuerUrl: trimTrailingSlash(getEnv('KEYCLOAK_ISSUER_URL')),
      clientId: getEnv('KEYCLOAK_CLIENT_ID'),
      clientSecret: getEnv('KEYCLOAK_CLIENT_SECRET'),
      redirectUri: getEnv('KEYCLOAK_REDIRECT_URI', this.app.url ? `${trimTrailingSlash(this.app.url)}/auth/callback` : undefined),
      logoutRedirectUri: getEnv('KEYCLOAK_LOGOUT_REDIRECT_URI', this.app.url),
      requiredRole: getEnv('KEYCLOAK_REQUIRED_ROLE', ''),
      adminRole: getEnv('KEYCLOAK_ADMIN_ROLE', 'alma-finance-admin'),
      libraryClaim: getEnv('KEYCLOAK_LIBRARY_CLAIM', 'library'),
      libraryRolePrefix: getEnv('KEYCLOAK_LIBRARY_ROLE_PREFIX', 'alma-finance-library-'),
      libraryGroupPrefix: getEnv('KEYCLOAK_LIBRARY_GROUP_PREFIX', '/alma-finance/libraries/'),
      defaultLibrary: getEnv('KEYCLOAK_DEFAULT_LIBRARY', ''),
      libraryOptions: getListEnv('KEYCLOAK_LIBRARY_OPTIONS', 'SHLDS,LAW'),
    };

    this.db = {
      host: getEnv('MYSQL_HOST'),
      user: getEnv('MYSQL_USER'),
      database: getEnv('MYSQL_DATABASE'),
      password: getEnv('MYSQL_PASSWORD'),
    };

    this.aggie = {
      boundaryAppUrl: getEnv('BOUNDARY_APP_URL'),
      tokenUrl: getEnv('TOKEN_URL'),
      tokenAuth: getEnv('TOKEN_AUTH'),
      consumerKey: getEnv('CONSUMER_KEY'),
      consumerSecret: getEnv('CONSUMER_SECRET'),
    };

    this.alma = {
      accessToken: getEnv('ACCESS_TOKEN'),
    };

    this.gl = {
      entity: getEnv('GL_ENTITY'),
      fund: getEnv('GL_FUND'),
      department: getEnv('GL_DEPARTMENT'),
      account: getEnv('GL_ACCOUNT'),
      purpose: getEnv('GL_PURPOSE'),
    };

    this.email = {
      user: getEnv('TRANSPORTERUSER'),
      pass: getEnv('TRANSPORTERPASS'),
      destination: getEnv('DESTINATIONEMAIL'),
    };

    this.gcloud = {
      project: getEnv('GCLOUD_PROJECT'),
      credentials: getEnv('GOOGLE_APPLICATION_CREDENTIALS'),
    };

    this.admin = getEnv('ADMIN');
  }
}

export default new Config();
