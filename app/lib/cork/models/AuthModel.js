import {BaseModel} from '@ucd-lib/cork-app-utils';
import AuthStore from '../stores/AuthStore.js';
import AuthService from '../services/AuthService.js';
import { appConfig } from '../../appGlobals.js';

/**
 * @description Model for handling authentication against keycloak
 */
class AuthModel extends BaseModel {

  constructor() {
    super();

    this.store = AuthStore;
    this.service = AuthService;

    // Lifespan of client access token entered in keycloak
    this.tokenRefreshRate = 300;

    // Interval for checking if user still has an active session
    this.loginCheckRefreshRate = 10 * 60 * 1000;

    this.silentCheckSsoRedirectUri = 'silent-check-sso.html';

    this.register('AuthModel');
  }

  /**
   * @description Initializes model. Starts interval for checking session status
   * @returns
   */
  init(){
    if ( this._init ) return;
    this.client = appConfig.auth?.keycloakClient;

    if ( !this.client ) {
      console.warn('Failed to initialize AuthModel: No keycloak client found in appConfig');
      return;
    }
    this._init = true;

    setInterval(async () => {
      this.client.updateToken(this.tokenRefreshRate);
    }, this.loginCheckRefreshRate );

  }

  /**
   * @description Logs user out of application
   */
   async logout(){
    await this.clearTokenServerCache();
    const redirectUri = window.location.origin + '/logged-out.html';
    try {
      this.client.logout({redirectUri});
    } catch (e) {
      window.location = redirectUri;
    }
  }

  /**
   * @description Send user to "unauthorized" page
   */
  redirectUnauthorized(){
    window.location = window.location.origin + '/unauthorized.html';
  }

  /**
   * @description Returns access token of logged in user
   * @returns {AccessToken}
   */
  getToken(){
    return this.store.token;
  }

  /**
   * @description Returns true if logged in user would like to log out
   * @param {Object} location - location object from AppStateStore
   * @returns {Boolean}
   */
  logOutRequested(location){
    if ( location?.path?.[0] === 'logout' ) {
      return true;
    }
    return false;
  }

  /**
   * @description Clears server cache of user's access token
   * @returns
   */
  async clearTokenServerCache(){
    let state = this.store.serverCacheCleared;
    try {
      if ( state.state === 'loading' ){
        await state.request
      } else {
        await this.service.clearTokenServerCache();
      }
    } catch(e) {}
    return this.store.serverCacheCleared;
  }

  /**
   * @description Fires when a token has been successfully refreshed
   */
  _onAuthRefreshSuccess(){
    this.store.setToken(this.client.tokenParsed);
    if ( !this.store.token.hasAccess ){
      this.redirectUnauthorized();
    }
  }

  /**
   * @description Logs user out if access token fails to refresh (their session expired)
   */
   _onAuthRefreshError(){
    this.logout();
  }

}

const model = new AuthModel();
export default model;
