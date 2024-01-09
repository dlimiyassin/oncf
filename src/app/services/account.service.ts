import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/api/employe/profile';

  private loggedIn = new BehaviorSubject<boolean>(this.Token.loggedIn());

  authStatus = this.loggedIn.asObservable();

  constructor(private Token: TokenService, private http: HttpClient) {}

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }

  // fetch user data
  getUserByEmail(email: string): Observable<User> {
    const url = `http://localhost:8080/api/auth/profile/${email}`;
    return this.http.get<User>(url);
  }

  updateUser(user: User): Observable<User> {
    const { firstname, lastname, birthdate } = user;
    const updatedUser = {
      firstname,
      lastname,
      birthdate,
    };
    const url = `http://localhost:8080/api/auth/profile/${user.email}`;
    return this.http.put<User>(url, updatedUser);
  }

  uploadImage(uploadImageData: any, email: string): Observable<any> {
    const url = `http://localhost:8080/api/auth/profile/upload/${email}`;
    return this.http.post<any>(url, uploadImageData, { observe: 'response' });
  }
  getImage(email: any): Observable<any> {
    const url = `http://localhost:8080/api/auth/profile/upload/get/${email}`;
    return this.http.get<any>(url);
  }
  removePicture(email: string): Observable<any> {
    const url = `http://localhost:8080/api/auth/profile/removePic/${email}`;
    return this.http.put<any>(url, {});
  }
}
