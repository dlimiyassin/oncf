import { Component, OnInit, inject, TemplateRef } from '@angular/core';
import { Quiz } from './../models/quiz';
import { QuizService } from '../services/quiz.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-quiz-rh',
  templateUrl: './quiz-rh.component.html',
  styleUrls: ['./quiz-rh.component.css'],
})
export class QuizRhComponent implements OnInit {
  constructor(private quiz: QuizService, private quizService: QuizService) {}

  ngOnInit(): void {
    this.getQuiz();
    this.refreshQuizStatus();
  }

  /* ------------------------------------   Get quiz satuts  -------------------------------------- */

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
  onToggleQuizStatus(): void {
    this.quizService.changeQuizStatus().subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error changing quiz status:', err);
      },
    });
  }
  /* ------------------------------------   Fetch All quizzes  -------------------------------------- */
  Quiz: Quiz[] = [];
  getQuiz() {
    this.quiz.getQuiz().subscribe({
      next: (response: Quiz[]) => {
        console.log(response);
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
    this.quiz.addQuiz(newQuiz).subscribe({
      next: (rep: Quiz[]) => {
        console.log(rep);
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
    this.quiz.deleteQuiz(quizId).subscribe({
      next: (rep) => {
        console.log(rep);
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
    this.quiz.getQuizByID(id).subscribe({
      next: (quiz) => {
        console.log(quiz);
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
    this.quiz.updateQuiz(newQuiz, quizId).subscribe({
      next: (rep) => {
        console.log(rep);
        this.getQuiz();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /* ------------------------------------   Delete all quizzes   -------------------------------------- */

  deleteAllQuizzes() {
    this.quiz.deleteAllQuiz().subscribe({
      next: (rep) => {
        console.log(rep);
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
