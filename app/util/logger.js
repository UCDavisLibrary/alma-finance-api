// logger.js
require('dotenv').config();
const { Logging } = require('@google-cloud/logging');

/*
Here are the valid severity levels in Google Cloud Logging, in increasing order of urgency:
	1.	DEFAULT – The log entry has no assigned severity level.
	2.	DEBUG – Debug or trace information.
	3.	INFO – Routine information, such as ongoing status or performance.
	4.	NOTICE – Normal but significant events, such as start-up, shut-down, or configuration changes.
	5.	WARNING – Warning events might cause problems.
	6.	ERROR – Error events are likely to cause problems.
	7.	CRITICAL – Critical events cause more severe problems or outages.
	8.	ALERT – Action must be taken immediately.
	9.	EMERGENCY – A panic condition, system is unusable.
*/

const logging = new Logging({ projectId: process.env.GCLOUD_PROJECT });
const log = logging.log('alma-payments'); // Custom log name

const resource = { type: 'global' };

async function logMessage(severity = 'DEFAULT', message, context = {}) {
  const labels = {
    itisScript: 'alma-payments',
  };

  if (severity === 'ERROR') {
    labels.itisScriptAlertOnError = 'true'; // must be a string
  }

  const metadata = {
    resource,
    severity,
    labels,
  };

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