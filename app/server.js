import express from 'express';
import cors from 'cors';
import config from './util/config.js';
import routes from './routes/index.js';
import staticMiddleware from './lib/static.js';
import { checkTransporter } from './util/nodemailer-transporter.js';
import { logMessage } from './util/logger.js';

const transporter = checkTransporter();
transporter.verify((error) => {
  if (error) {
    logMessage('WARNING', error);
  } else {
    logMessage('INFO', 'Server is ready to take our messages');
  }
});

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API and auth routes
app.use(routes);

// SPA static file serving (must come after API routes)
staticMiddleware(app);

app.listen(config.app.port, () => {
  logMessage('INFO', `Listening on port ${config.app.port}...`);
});
