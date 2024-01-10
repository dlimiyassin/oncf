import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { AccountService } from '../../services/account.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DatePipe],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });
  errorMessage: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  onLogin() {
    this.errorMessage = null;
    const credentials = {
      email: this.loginForm.get('email')?.value as string,
      password: this.loginForm.get('password')?.value as string,
    };
    this.authService.login(credentials).subscribe({
      next: (data) => {
        console.log(data);
        this.authService.handleResponse(data),
          this.router.navigateByUrl('/dashboard');
        this.toaster.success('You logged in successfully', 'Success', {
          timeOut: 1000,
        });
      },
      error: (err) => {
        console.log(err);
        if (err.status === 403) {
          // Handle incorrect credentials error
          this.errorMessage = 'Password or email is incorrect';
        } else {
          // Handle other errors
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }
  forgetPassword() {
    this.router.navigateByUrl('/ask-email');
  }
}
