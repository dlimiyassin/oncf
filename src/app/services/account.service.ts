import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = environment.apiUrl + '/auth/profile';

  private loggedIn = new BehaviorSubject<boolean>(this.Token.loggedIn());

  authStatus = this.loggedIn.asObservable();

  constructor(private Token: TokenService, private http: HttpClient) {}

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  // fetch user data
  getUserByEmail(email: string): Observable<User> {
    const url = this.apiUrl + `/${email}`;
    return this.http.get<User>(url);
  }

  updateUser(user: User): Observable<User> {
    const { firstname, lastname, birthdate } = user;
    const updatedUser = {
      firstname,
      lastname,
      birthdate,
    };
    const url = this.apiUrl + `/${user.email}`;
    return this.http.put<User>(url, updatedUser);
  }

  uploadImage(uploadImageData: any, email: string): Observable<any> {
    const url = this.apiUrl + `/upload/${email}`;
    return this.http.post<any>(url, uploadImageData, { observe: 'response' });
  }
  getImage(email: any): Observable<any> {
    const url = this.apiUrl + `/upload/get/${email}`;
    return this.http.get<any>(url);
  }
  removePicture(email: string): Observable<any> {
    const url = this.apiUrl + `/removePic/${email}`;
    return this.http.put<any>(url, {});
  }
}
