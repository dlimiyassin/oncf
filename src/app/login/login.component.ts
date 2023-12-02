import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginObj: any = {
    email: '',
    password: '',
  };
  errorMessage: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private token: TokenService,
    private account: AccountService
  ) {}

  ngOnInit(): void {}

  onLogin() {
    this.errorMessage = null;
    this.authService.login(this.loginObj).subscribe({
      next: (data) => {
        console.log(data);
        this.authService.handleResponse(data),
          this.router.navigateByUrl('/dashboard');
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
}
