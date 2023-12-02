import { compileClassMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  set(data: any) {
    localStorage.setItem('accessToken', data.accessToken);
  }

  handle(data: any) {
    this.set(data);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  remove() {
    localStorage.removeItem('accessToken');
  }



  payload(accessToken: any) {
    let decodedJwt = jwtDecode(accessToken);
    return decodedJwt;
  }

  isValid() {
    const token = this.getToken();

    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return true;
      }
    }
    return false;
  }

  
  loggedIn() {
    return this.isValid();
  }



    getInfos() {
      const token = this.getToken();
  
      if (token) {
        const payload = this.payload(token);
        return payload ? payload : null;
      }
  
      return null;
    }
}
