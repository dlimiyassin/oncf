import { Component, TemplateRef, inject, ViewEncapsulation } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { Router} from '@angular/router';
import {  ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-employe-auth',
  templateUrl: './employe-auth.component.html',
  styleUrls: ['./employe-auth.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeAuthComponent {
  private ngUnsubscribe = new Subject<void>();
  private modalService = inject(NgbModal);
  #quizService = inject(QuizService);
  #toaster = inject(ToastrService);
  email!: string;
  checkEmail(content: TemplateRef<any>) {
    this.#quizService
      .checkEmail(this.email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          if (data) {
            this.openBackDropCustomClass(content);
          } else {
            this.#toaster.error('This email does not exist', 'Error', {
              timeOut: 2000,
            });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  openBackDropCustomClass(content: TemplateRef<any>) {
    this.modalService.open(content, {
      backdropClass: 'light-blue-backdrop',
      size: 'lg',
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
