const CronJob = require('cron').CronJob;

const {checkOracleStatus, archivePaidInvoices} = require('./controllers/background-scripts');
const { checkTransporter } = require('./util/nodemailer-transporter');
const { postToSlackChannel } = require('./util/post-to-slack-channel');
const transporter = checkTransporter();
const { logMessage } = require('./util/logger');

logMessage('DEBUG','File loader server has restarted.');

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      logMessage('DEBUG',error);
    } else {
      logMessage('INFO','Transporter: Server is ready to take our messages');
    }
  });

const archiveInvoices = new CronJob(
  // run at 6:15pm every day
  '0 15 18 * * *',
  async function() {
      // once a day, archive paid invoices to the server at directory specified in docker-compose.yml
      archivePaidInvoices();
  },
  null,
  true,
  'America/Los_Angeles'
);

const exportInvoices = new CronJob(
    // run at 6:30pm every day
    '0 30 18 * * *',
    async function() {
        // once a day, export paid invoices to the server at directory specified in docker-compose.yml
        checkOracleStatus();        
    },
    null,
    true,
    'America/Los_Angeles'
);

archiveInvoices.start();
exportInvoices.start();