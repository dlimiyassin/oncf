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
    const url = `${this.apiUrl}/${email}`;
    return this.http.get<User>(url);
  }

  updateUser(user : User): Observable<User>{
  const { firstname, lastname, password } = user;

  // Create a new object with the selected properties
  const updatedUser = {
    firstname,
    lastname,
    password,
  };
    const url = `${this.apiUrl}/${user.email}`
    return this.http.put<User>(url, updatedUser);
  }
}
