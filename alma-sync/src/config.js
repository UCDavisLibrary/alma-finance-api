import dotenv from 'dotenv';

dotenv.config();

function getEnv(key, defaultValue = undefined) {
  return process.env[key] ?? defaultValue;
}

function getNumberEnv(key, defaultValue) {
  const value = Number(getEnv(key, defaultValue));
  return Number.isFinite(value) ? value : defaultValue;
}

function getListEnv(key, defaultValue) {
  return getEnv(key, defaultValue)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default {
  app: {
    isLocal: getEnv('IS_LOCAL', 'true') === 'true',
  },
  alma: {
    baseUrl: getEnv('ALMA_PROXY_BASE_URL', 'http://alma-proxy:5555').replace(/\/+$/, ''),
    readyInvoiceLimit: getNumberEnv('ALMA_SYNC_READY_INVOICE_LIMIT', 99),
    readyInvoiceMaxPages: getNumberEnv('ALMA_SYNC_READY_INVOICE_MAX_PAGES', 2),
  },
  db: {
    host: getEnv('MYSQL_HOST'),
    user: getEnv('MYSQL_USER'),
    database: getEnv('MYSQL_DATABASE'),
    password: getEnv('MYSQL_PASSWORD'),
  },
  sync: {
    intervalMs: getNumberEnv('ALMA_SYNC_INTERVAL_MS', 60000),
    cacheTtlHours: getNumberEnv('ALMA_SYNC_CACHE_TTL_HOURS', 24),
    once: process.argv.includes('--once') || getEnv('ALMA_SYNC_ONCE', 'false') === 'true',
    libraries: getListEnv('KEYCLOAK_LIBRARY_OPTIONS', 'SHLDS,LAW'),
  },
  gcloud: {
    project: getEnv('GCLOUD_PROJECT'),
  },
};
