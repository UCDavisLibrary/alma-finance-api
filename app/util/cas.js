import CASAuthentication from 'node-cas-authentication';
import config from './config.js';

const cas = new CASAuthentication({
  cas_url: config.cas.url,
  service_url: config.app.url,
});

export default cas;
