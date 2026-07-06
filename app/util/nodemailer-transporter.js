import nodemailer from 'nodemailer';
import config from './config.js';

export function checkTransporter() {
  if (config.app.isLocal) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: 'smtp.lib.ucdavis.edu',
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });
}
