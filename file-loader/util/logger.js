// logger.js
require('dotenv').config();

const IS_LOCAL = process.env.IS_LOCAL !== 'false'; // prod sets false; everything else = local/dev

let log, resource;
if (!IS_LOCAL) {
  const { Logging } = require('@google-cloud/logging');
  const logging = new Logging({ projectId: process.env.GCLOUD_PROJECT });
  log = logging.log('alma-payments'); // Custom log name
  resource = { type: 'global' };
}

/**
 * Log to Google Cloud in prod, console elsewhere.
 * @param {'DEFAULT'|'DEBUG'|'INFO'|'NOTICE'|'WARNING'|'ERROR'|'CRITICAL'|'ALERT'|'EMERGENCY'} severity
 * @param {string} message
 * @param {object} context
 */
async function logMessage(severity = 'DEFAULT', message, context = {}) {
  if (IS_LOCAL) {
    // Local/dev: mirror severity to console and exit
    const level = String(severity || 'DEFAULT').toUpperCase();
    const isErr = ['ERROR', 'CRITICAL', 'ALERT', 'EMERGENCY'].includes(level);
    const out = isErr ? console.error : console.log;
    out(`[local][${level}] ${message}`, context);
    return;
  }

  // Production: write to Cloud Logging
  const labels = { itisScript: 'alma-payments' };
  if (severity === 'ERROR') labels.itisScriptAlertOnError = 'true'; // must be string

  const metadata = { resource, severity, labels };
  const entry = log.entry(metadata, {
    message,
    context,
    timestamp: new Date().toISOString(),
  });

  try {
    await log.write(entry);
    console.log(`✅ Logged ${severity} to Google Cloud:`, message);
  } catch (err) {
    console.error('❌ Failed to log error:', err);
  }
}

module.exports = { logMessage };