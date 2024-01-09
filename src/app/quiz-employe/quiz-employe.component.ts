import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../models/quiz';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-quiz-employe',
  templateUrl: './quiz-employe.component.html',
  styleUrls: ['./quiz-employe.component.css'],
})
export class QuizEmployeComponent implements OnInit {
  constructor(
    private quizService: QuizService,
    private toaster: ToastrService,
    private account: AccountService
  ) {}
  public loggedIn: boolean = false;

  ngOnInit(): void {
    this.getQuiz();
    this.refeshAuthStatus();
    this.refreshQuizStatus();
  }
  /* ------------------------------------   Get auth satuts  -------------------------------------- */
  refeshAuthStatus() {
    this.account.authStatus.subscribe((value) => {
      this.loggedIn = value;
    });
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
  /*--------------------------------------Fetch Quizzes ------------------------------------ */

  Quiz: Quiz[] = [];
  getQuiz() {
    this.quizService.getQuiztest().subscribe({
      next: (response: Quiz[]) => {
        console.log(response);
        this.Quiz = response;
        this.Quiz = this.shuffleQuizOptions(response); //  shuffle Options = khalat ajwiba (for whom cant speak english lol)
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

    this.quizService.submitAnswers(submittedAnswers).subscribe({
      next: (rep: { totalScore: number }) => {
        console.log(rep);
        this.totalScore = rep.totalScore;
        this.toaster.success(
          'Your score is : ' + this.totalScore + ' / '+ this.Quiz.length * 4,
          'Success',
          { timeOut: 3000 }
        );
        this.ngOnInit();
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
