const nodemailer = require('nodemailer');

exports.checkTransporter = () => {
  if (process.env.IS_LOCAL === 'true') {
    const transporterlocal = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.TRANSPORTERUSER,
          pass: process.env.TRANSPORTERPASS,
        },
      });
    return transporterlocal;
  }
  else {
    const transporterremote = nodemailer.createTransport({
        host: 'smtp.lib.ucdavis.edu',
        port: 25,
        secure: false,
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });
    return transporterremote;
  }
}