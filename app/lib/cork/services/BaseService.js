import { BaseService } from '@ucd-lib/cork-app-utils';
import { appConfig } from '../../appGlobals.js';

// TODO: If not using auth, you can remove this file

/**
 * @class BaseServiceImp
 * @description Extends the cork-app-utils BaseService to add auth headers to requests
 * Import this class instead of BaseService directly from @ucd-lib/cork-app-utils
 */
export default class BaseServiceImp extends BaseService {
  constructor() {
    super();
  }

  /**
   * @description Adds auth headers to request before calling super.request
   * @param {Object} options - request options
   * @returns
   */
  async request(options){
    if( appConfig.auth?.keycloakClient ) {
      const kc = appConfig.auth.keycloakClient;
      if( !options.fetchOptions ) options.fetchOptions = {};
      if( !options.fetchOptions.headers ) options.fetchOptions.headers = {};
      try {
        await kc.updateToken(10);
        options.fetchOptions.headers.Authorization = `Bearer ${kc.token}`
      } catch (error) {}
    }
    return await super.request(options);
  }
}
