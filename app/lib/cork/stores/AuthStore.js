import {BaseStore} from '@ucd-lib/cork-app-utils';
import AccessToken from '../../utils/AccessToken.js';

class AuthStore extends BaseStore {

  constructor() {
    super();

    this.token = new AccessToken();
    this.events = {
      TOKEN_REFRESHED: 'token-refreshed',
      TOKEN_SERVER_CACHE_CLEARED: 'token-server-cache-cleared'
    };
    this.serverCacheCleared = {};
  }

  setToken(token={}){
    this.token = new AccessToken(token);
    this.emit(this.events.TOKEN_REFRESHED, this.token);
  }

  serverCacheClearedLoading(request) {
    this._setServerCacheCleared({
      state : this.STATE.LOADING,
      request
    });
  }

  serverCacheClearedLoaded(payload) {
    this._setServerCacheCleared({
      state : this.STATE.LOADED,
      payload
    });
  }

  serverCacheClearedError(error) {
    this._setServerCacheCleared({
      state : this.STATE.ERROR,
      error
    });
  }

  _setServerCacheCleared(state) {
    this.serverCacheCleared = state;
    this.emit(this.events.TOKEN_SERVER_CACHE_CLEARED, state);
  }

}

const store = new AuthStore();
export default store;
