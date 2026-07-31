import config from './config.js';

let cloudLog;
let resource;
const pendingWrites = new Set();

if (!config.app.isLocal && config.gcloud.project) {
  try {
    const { Logging } = await import('@google-cloud/logging');
    const logging = new Logging({ projectId: config.gcloud.project });
    cloudLog = logging.log('alma-payments');
    resource = { type: 'global' };
  } catch (error) {
    console.error(JSON.stringify({
      level: 'ERROR',
      message: 'Failed to initialize Google Cloud Logging',
      service: 'alma-sync',
      timestamp: new Date().toISOString(),
      data: { error: error.message },
    }));
  }
}

function normalizeSeverity(level) {
  if (level === 'WARN') return 'WARNING';
  return level;
}

export function log(level, message, data = undefined) {
  const severity = normalizeSeverity(level);
  if (config.app.isLocal) {
    const entry = {
      level: severity,
      message,
      service: 'alma-sync',
      timestamp: new Date().toISOString(),
    };

    if (data !== undefined) entry.data = data;

    const output = severity === 'ERROR' || severity === 'DEBUG'
      ? console.error
      : console.log;
    output(JSON.stringify(entry));
    return;
  }

  if (!cloudLog) return;

  const timestamp = new Date().toISOString();
  const labels = { itisScript: 'alma-payments' };
  if (severity === 'ERROR') labels.itisScriptAlertOnError = 'true';

  const cloudEntry = cloudLog.entry(
    { resource, severity, labels },
    {
      message,
      context: data ?? {},
      timestamp,
      service: 'alma-sync',
    }
  );

  const write = cloudLog.write(cloudEntry)
    .catch((error) => {
      console.error(JSON.stringify({
        level: 'ERROR',
        message: 'Failed to write Google Cloud log entry',
        service: 'alma-sync',
        timestamp: new Date().toISOString(),
        data: { error: error.message },
      }));
    })
    .finally(() => pendingWrites.delete(write));

  pendingWrites.add(write);
}

export async function flushLogs() {
  await Promise.allSettled([...pendingWrites]);
}
