import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerObj: any = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    birthdate: Date,
    gender: '',
  };
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {}
errorMessage! : string;
  onRegister() {
    this.authService.register(this.registerObj).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/verification');
      },
      error: (err) => {
        console.log(err);
        this.errorMessage="This user is already exist!"
      },
    });
  }
}
