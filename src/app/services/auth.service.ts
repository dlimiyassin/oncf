import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from './token.service';
import { AccountService } from './account.service';
//import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //isAuthenticated: boolean = false;
  //roles: any;
  //username: any;
  //accessToken!: any;

  constructor(
    private http: HttpClient,
    private token: TokenService,
    private account: AccountService
  ) {}

  public login(data: { email: string; password: string }) {
    
    return this.http.post('http://localhost:8080/api/auth/authenticate', data);
  }

  register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    birthdate: Date;
    gender: string;
  }) {
    return this.http.post('http://localhost:8080/api/auth/register', data);
  }

  handleResponse(data: any) {
    this.token.handle(data);
    this.account.changeAuthStatus(true);
  }

  //loadProfile(data: any) {
  //  this.accessToken = data['accessToken'];
  //  let decodedJwt = jwtDecode(this.accessToken);   !!!!!!!!!!!!
  //  this.username = decodedJwt.sub;
  //  this.isAuthenticated=true;
  //}
}
