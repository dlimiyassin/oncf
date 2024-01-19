import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../models/quiz';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quiz-employe',
  templateUrl: './quiz-employe.component.html',
  styleUrls: ['./quiz-employe.component.css'],
})
export class QuizEmployeComponent implements OnInit, OnDestroy {
  constructor(
    private quizService: QuizService,
    private toaster: ToastrService,
    private account: AccountService
  ) {}
  public loggedIn: boolean = false;

  private ngUnsubscribe = new Subject<void>();
  
  ngOnInit(): void {
    this.getQuiz();
    this.refeshAuthStatus();
    this.refreshQuizStatus();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  /* ------------------------------------   Get auth satuts  -------------------------------------- */
  refeshAuthStatus() {
    this.account.authStatus
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.loggedIn = value;
      });
  }
  /* ------------------------------------  Get quiz satuts  -------------------------------------- */

  quizStatus!: boolean;
  refreshQuizStatus() {
    this.quizService
      .getQuizStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (status) => {
          this.quizStatus = status;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  /*--------------------------------------Fetch Quizzes ------------------------------------ */

  Quiz: Quiz[] = [];
  getQuiz() {
    this.quizService
      .getQuiztest()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: Quiz[]) => {
          this.Quiz = response;
          this.Quiz = this.shuffleQuizOptions(response); //  shuffle Options
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /*-------------------------------------- Shuffle Options ------------------------------------ */

  shuffleQuizOptions(quizArray: Quiz[]): Quiz[] {
    return quizArray.map((quiz) => {
      const optionsArray = [
        quiz.option1,
        quiz.option2,
        quiz.option3,
        quiz.option4,
      ];
      this.shuffleArray(optionsArray);
      return new Quiz(
        quiz.id || 0,
        quiz.question,
        optionsArray[0],
        optionsArray[1],
        optionsArray[2],
        optionsArray[3]
      );
    });
  }

  shuffleArray(array: string[]): void {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /*-------------------------------------- Send Employe Answers ------------------------------------ */

  selectedOptions: { questionId: number; selectedOption: string }[] = [];
  totalScore!: number;
  submitAnswers() {
    const submittedAnswers = this.selectedOptions;

    this.quizService
      .submitAnswers(submittedAnswers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (rep: { totalScore: number }) => {
          this.totalScore = rep.totalScore;
          this.toaster.success(
            'Your score is : ' + this.totalScore + ' / ' + this.Quiz.length * 4,
            'Success',
            { timeOut: 3000 }
          );
          this.getQuiz()
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /*--------------------- For binding the selected radio button to the selected option-------------------- */

  onOptionSelected(questionId: any, selectedOption: string) {
    // Update selectedOptions array
    const index = this.selectedOptions.findIndex(
      (option) => option.questionId === questionId
    );
    if (index !== -1) {
      // Update existing entry
      this.selectedOptions[index].selectedOption = selectedOption;
    } else {
      // Add new entry
      this.selectedOptions.push({ questionId, selectedOption });
    }
  }
}
