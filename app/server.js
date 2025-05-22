const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const routes = require('./routes/routes');
const { checkTransporter } = require('./util/nodemailer-transporter');
const { logMessage } = require('./util/logger');
const transporter = checkTransporter();

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      logMessage('ERROR',error);
    } else {
      console.log('Server is ready to take our messages');
      logMessage('INFO','Server is ready to take our messages');
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
  logMessage('INFO',`Listening on port ${PORT}...`);
});