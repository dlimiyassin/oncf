import { Injectable } from '@angular/core';
import { Employe } from '../models/employe.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  private apiUrl = 'http://localhost:8080/api/employe';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.apiUrl);
  }

  getAllEmployes(keyword : string , page : number  , size : number ){
    const url = `${this.apiUrl}?keyword=${keyword}&page=${page}&size=${size}`;
    return this.http.get(url,{observe:'response'});
  }


  getAllNotifications(): Observable<Employe[]> {
    const url = `${this.apiUrl}/notify`;
    return this.http.get<Employe[]>(url);
  }

  // get un Employe par cne
  getEmployeById(id: number): Observable<Employe> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Employe>(url);
  }

  // methode pour ajouter un Employe
  createEmploye(employe: Employe): Observable<Employe> {
    return this.http.post<Employe>(this.apiUrl, employe);
  }

  // methode pour modifier un Employe
  updateEmploye(employe: Employe): Observable<Employe> {
    const url = `${this.apiUrl}/${employe.id}`;
    return this.http.put<Employe>(url, employe);
  }

  // methode pour supprimer un Employe
  deleteEmploye(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  timeLeft(date: Date | null): string {
    if (!date || !(date instanceof Date)) {
      return '';
    }

    const currentDate = new Date();
    const differenceInMilliseconds = date.getTime() - currentDate.getTime();
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return `${differenceInDays} days left`;
  }

  //******************Search************

  searchEmployes(keyword: string, page: number, size: number): Observable<Employe[]> {
    const url = `${this.apiUrl}/search?keyword=${keyword}&page=${page}&size=${size}`;
    return this.http.get<Employe[]>(url);
  }



}
