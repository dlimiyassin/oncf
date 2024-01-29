import { Component, OnInit, inject, TemplateRef, OnDestroy } from '@angular/core';
import { Quiz } from './../models/quiz';
import { QuizService } from '../services/quiz.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-quiz-rh',
  templateUrl: './quiz-rh.component.html',
  styleUrls: ['./quiz-rh.component.css'],
})
export class QuizRhComponent implements OnInit, OnDestroy {
  constructor(private quiz: QuizService, private quizService: QuizService) {}

  private ngUnsubscribe = new Subject<void>();
  
  ngOnInit(): void {
    this.getQuiz();
    this.refreshQuizStatus();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /* ------------------------------------   Get quiz satuts  -------------------------------------- */

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
  onToggleQuizStatus(): void {
    this.quizService
      .changeQuizStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.refreshQuizStatus();
        },
        error: (err) => {
          console.error('Error changing quiz status:', err);
        },
      });
  }
  /* ------------------------------------   Fetch All quizzes  -------------------------------------- */
  Quiz: Quiz[] = [];
  getQuiz() {
    this.quiz
      .getQuiz()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: Quiz[]) => {
          this.Quiz = response;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /* ------------------------------------     Add new quiz     -------------------------------------- */

  NewQuizForm = new FormGroup({
    question: new FormControl('', Validators.required),
    option1: new FormControl('', Validators.required),
    option2: new FormControl('', Validators.required),
    option3: new FormControl('', Validators.required),
    option4: new FormControl('', Validators.required),
  });

  addNewQuiz() {
    const newQuiz: Quiz = {
      question: this.NewQuizForm.get('question')?.value as string,
      option1: this.NewQuizForm.get('option1')?.value as string,
      option2: this.NewQuizForm.get('option2')?.value as string,
      option3: this.NewQuizForm.get('option3')?.value as string,
      option4: this.NewQuizForm.get('option4')?.value as string,
    };
    this.quiz
      .addQuiz(newQuiz)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (rep: Quiz[]) => {
          this.getQuiz();
          this.NewQuizForm.reset();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  openAddXl(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'xl' });
  }
  /* ------------------------------------   Delete single quiz   -------------------------------------- */

  deleteQuizById(quizId?: number) {
    this.quiz
      .deleteQuiz(quizId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (rep) => {
          this.getQuiz();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  /* ----------------------------------------   Edit quizzes   -------------------------------------- */

  private modalService = inject(NgbModal);
  openXl(content: TemplateRef<any>, idQuiz?: number) {
    this.modalService.open(content, { size: 'xl' });
    this.getQuizById(idQuiz);
  }
  updateQuizForm = new FormGroup({
    id: new FormControl(''),
    question: new FormControl('', Validators.required),
    option1: new FormControl('', Validators.required),
    option2: new FormControl('', Validators.required),
    option3: new FormControl('', Validators.required),
    option4: new FormControl('', Validators.required),
  });
  getQuizById(id?: number) {
    this.quiz
      .getQuizByID(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (quiz) => {
          this.updateQuizForm.setValue({
            id: String(quiz.id),
            question: quiz.question,
            option1: quiz.option1,
            option2: quiz.option2,
            option3: quiz.option3,
            option4: quiz.option4,
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  quizId!: number;
  updateQuiz() {
    const quizId = Number(this.updateQuizForm.get('id')?.value);
    const newQuiz: Quiz = {
      question: this.updateQuizForm.get('question')?.value as string,
      option1: this.updateQuizForm.get('option1')?.value as string,
      option2: this.updateQuizForm.get('option2')?.value as string,
      option3: this.updateQuizForm.get('option3')?.value as string,
      option4: this.updateQuizForm.get('option4')?.value as string,
    };
    this.quiz
      .updateQuiz(newQuiz, quizId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (rep) => {
          this.getQuiz();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  /* ------------------------------------   Delete all quizzes   -------------------------------------- */

  deleteAllQuizzes() {
    this.quiz
      .deleteAllQuiz()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.getQuiz();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  openConfirmationModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'sm' });
  }
}
