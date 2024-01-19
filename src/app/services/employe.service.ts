import { Injectable } from '@angular/core';
import { Employe } from '../models/employe.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EmployeResponse } from '../models/employe-response.model';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  private apiUrl = environment.apiUrl + '/employe';
  constructor(private http: HttpClient) {}

  private employesStore = new BehaviorSubject<Employe[]>([]);
  employes$ = this.employesStore.asObservable();

  updateEmployesStore(employes: Employe[]): void {
    this.employesStore.next(employes);
  }

  getAllEmployes(
    keyword: string = '',
    page: number,
    size: number
  ): Observable<EmployeResponse> {
    const url = `${this.apiUrl}?keyword=${keyword}&page=${page}&size=${size}`;
    return this.http.get<EmployeResponse>(url, {
      withCredentials: true,
      responseType: 'json',
    });
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
  createEmploye<N>(employe: N): Observable<N> {
    return this.http.post<N>(this.apiUrl, employe);
  }

  // methode pour modifier un Employe
  updateEmploye<N>(employe: N, id: number): Observable<N> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<N>(url, employe);
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
}
