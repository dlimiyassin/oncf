import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  userForm = new FormGroup({
    lastname : new FormControl(null,[Validators.required,Validators.minLength(3)]),
    firstname : new FormControl(null,[Validators.required,Validators.minLength(3)]),
    email : new FormControl(null,[Validators.required,Validators.email]),
    birthDate : new FormControl(null,Validators.required),
    password : new FormControl(null,[Validators.required,Validators.minLength(8)])
  });


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
