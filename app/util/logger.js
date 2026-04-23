import config from './config.js';

let log, resource;
if (!config.app.isLocal) {
  const { Logging } = await import('@google-cloud/logging');
  const logging = new Logging({ projectId: config.gcloud.project });
  log = logging.log('alma-payments');
  resource = { type: 'global' };
}

export async function logMessage(severity = 'DEFAULT', message, context = {}) {
  if (config.app.isLocal) {
    return;
  }

  const labels = { itisScript: 'alma-payments' };
  if (severity === 'ERROR') labels.itisScriptAlertOnError = 'true';

  const metadata = { resource, severity, labels };
  const entry = log.entry(metadata, {
    message,
    context,
    timestamp: new Date().toISOString(),
  });

  try {
    await log.write(entry);
  } catch (err) {
    // intentionally silent
  }
}
