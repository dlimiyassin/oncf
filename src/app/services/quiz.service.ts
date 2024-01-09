import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'http://localhost:8080/api/quiz';
  constructor(private http: HttpClient) {}

  getQuiz(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }
  getQuiztest(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>('http://localhost:8080/api/test');
  }
  getQuizByID(quizId?: number): Observable<Quiz> {
    const url = `${this.apiUrl}/${quizId}`;
    return this.http.get<Quiz>(url);
  }
  addQuiz(newQuiz: Quiz): Observable<Quiz[]> {
    return this.http.post<Quiz[]>(this.apiUrl, newQuiz);
  }
  updateQuiz(updatedQuiz: Quiz, id?: number): Observable<Quiz[]> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Quiz[]>(url, updatedQuiz);
  }
  deleteQuiz(quizId?: number): Observable<void> {
    const url = `${this.apiUrl}/${quizId}`;
    return this.http.delete<void>(url);
  }
  deleteAllQuiz(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  submitAnswers(
    submittedAnswers: { questionId: number; selectedOption: string }[]
  ): Observable<{ totalScore: number }> {
    const url = 'http://localhost:8080/api/test';
    return this.http.post<{ totalScore: number }>(url, submittedAnswers);
  }

  getQuizStatus(): Observable<boolean> {
    return this.http.get<boolean>('http://localhost:8080/api/test/get-status');
  }
  changeQuizStatus(): Observable<void> {
    return this.http.get<void>('http://localhost:8080/api/test/change-status');
  }
}
