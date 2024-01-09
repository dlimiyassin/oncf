import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.refreshQuizStatus();
  }
  /* ------------------------------------  Get quiz satuts  -------------------------------------- */

  quizStatus!: boolean;
  refreshQuizStatus() {
    this.quizService.getQuizStatus().subscribe({
      next: (status) => {
        console.log(status);
        this.quizStatus = status;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
