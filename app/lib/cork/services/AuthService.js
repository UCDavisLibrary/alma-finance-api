import BaseService from "./BaseService.js";
import AuthStore from '../stores/AuthStore.js';
import { appConfig } from '../../appGlobals.js';

class AuthService extends BaseService {

  constructor() {
    super();
    this.store = AuthStore;
  }

  clearTokenServerCache(){
    return this.request({
      url : `${appConfig.apiRoot}/auth/clear-cache`,
      onLoading : request => this.store.serverCacheClearedLoading(request),
      onLoad : result => this.store.serverCacheClearedLoaded(result.body),
      onError : e => this.store.serverCacheClearedError(e)
    });
  }

}

const service = new AuthService();
export default service;
