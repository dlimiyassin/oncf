import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrlForQuiz = environment.apiUrl+'/quiz';
  private apiUrlForTest = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getQuiz(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrlForQuiz);
  }
  getQuiztest(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrlForTest+'/test');
  }
  getQuizByID(quizId?: number): Observable<Quiz> {
    const url = `${this.apiUrlForQuiz}/${quizId}`;
    return this.http.get<Quiz>(url);
  }
  addQuiz(newQuiz: Quiz): Observable<Quiz[]> {
    return this.http.post<Quiz[]>(this.apiUrlForQuiz, newQuiz);
  }
  updateQuiz(updatedQuiz: Quiz, id?: number): Observable<Quiz[]> {
    const url = `${this.apiUrlForQuiz}/${id}`;
    return this.http.put<Quiz[]>(url, updatedQuiz);
  }
  deleteQuiz(quizId?: number): Observable<void> {
    const url = `${this.apiUrlForQuiz}/${quizId}`;
    return this.http.delete<void>(url);
  }
  deleteAllQuiz(): Observable<void> {
    return this.http.delete<void>(this.apiUrlForQuiz);
  }

  submitAnswers(
    submittedAnswers: { questionId: number; selectedOption: string }[]
  ): Observable<{ totalScore: number }> {
    const url = this.apiUrlForTest + '/test';
    return this.http.post<{ totalScore: number }>(url, submittedAnswers);
  }

  getQuizStatus(): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrlForTest + '/test/get-status');
  }
  changeQuizStatus(): Observable<void> {
    return this.http.get<void>(this.apiUrlForTest + '/test/change-status');
  }
}
