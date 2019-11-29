import { getUserToken } from './auth';

export default class SessionManager {
  static myInstance = null;
  userToken = '';

    constructor() {
    this.userToken=getUserToken();
  }

  saveSessionUserToken() {
    getUserToken()
      .then(token => {
        this.userToken = token;
      })
      .catch(err => {
        this.userToken = '';
      });
  }
  static shared() {
    if (SessionManager.myInstance == null) {
        SessionManager.myInstance = new SessionManager();
    }

    return this.myInstance;
  }
  getAuthorizationHeader = () => {
    return {
      headers: {
        'Authorization': 'Bearer ' + this.userToken,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  };
}
