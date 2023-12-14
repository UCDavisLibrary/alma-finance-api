const express = require('express');
const bodyParser = require('body-parser');
const CronJob = require('cron').CronJob;
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const routes = require('./routes/routes');
const db = require('./util/database');
const {checkOracleStatus, archivePaidInvoices} = require('./controllers/background-scripts');
const { checkTransporter } = require('./util/nodemailer-transporter');
const transporter = checkTransporter();

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

// instantiate an express app
const app = express();

// cors
app.use(cors({ origin: '*' }));

// here you set that all templates are located in `/views` directory
app.set('views', __dirname + '/views');

// here you set that you're using `ejs` template engine, and the
// default extension is `ejs`
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/views', express.static(process.cwd() + '/views')); //make public static

app.use(routes);

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
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