import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from './token.service';
import { AccountService } from './account.service';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private token: TokenService,
    private account: AccountService
  ) {}

  private apiUrl = environment.apiUrl + '/auth';

  public login(data: { email: string; password: string }) {
    return this.http.post(this.apiUrl + '/authenticate', data);
  }

  register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    birthdate: Date;
    gender: string;
  }) {
    return this.http.post(this.apiUrl + '/register', data);
  }

  handleResponse(data: any) {
    this.token.handle(data);
    this.account.changeAuthStatus(true);
  }

  forgetPassword(email: string) {
    const url = this.apiUrl + `/forget-password?email=${email}`;
    return this.http.get(url);
  }

  updatePassword(data: {
    email: string;
    password: string;
    renewPassword: string;
  }) {
    return this.http.post(this.apiUrl + '/update-password', data);
  }

  updateProfilePassword(data: {
    oldPassword: string;
    newPassword: string;
    renewPassword: string;
    username: string;
  }): Observable<string> {
    const url = this.apiUrl + `/${data.username}/update-password?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`;
    return this.http.put<string>(url, null);
  }

  //loadProfile(data: any) {
  //  this.accessToken = data['accessToken'];
  //  let decodedJwt = jwtDecode(this.accessToken);   !!!!!!!!!!!!
  //  this.username = decodedJwt.sub;
  //  this.isAuthenticated=true;
  //}
}
