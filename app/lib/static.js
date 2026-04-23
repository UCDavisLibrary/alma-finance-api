import path from 'path';
import express from 'express';
import spaMiddleware from '@ucd-lib/spa-router-middleware';
import { fileURLToPath } from 'url';
import config from '../util/config.js';
import cas from '../util/cas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (app) => {
  const assetsDir = path.join(__dirname, '../client/public');
  const bundle = `
    <link rel="stylesheet" href="/css/dev/${config.app.stylesheetName}">
    <script src='/js/dev/${config.app.bundleName}' defer></script>
  `;

  // Serve FontAwesome webfonts
  const faWebfonts = path.join(__dirname, '../node_modules/@fortawesome/fontawesome-free/webfonts');
  app.use('/fonts/fontawesome', express.static(faWebfonts));

  // Require CAS auth for all SPA routes (but not static assets like js/css)
  app.use((req, res, next) => {
    if (/^\/(js|css|img|fonts)\//.test(req.path)) return next();
    cas.bounce(req, res, next);
  });

  spaMiddleware({
    app,
    htmlFile: path.join(assetsDir, 'index.html'),
    isRoot: true,
    appRoutes: config.app.routes,
    static: {
      dir: assetsDir,
    },
    enable404: false,

    getConfig: async (req, res, next) => {
      next({
        appRoutes: config.app.routes,
      });
    },

    template: (req, res, next) => {
      next({
        title: config.app.title,
        bundle,
      });
    },
  });
};
