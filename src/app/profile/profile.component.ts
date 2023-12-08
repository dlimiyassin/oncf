import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    birthdate: new Date(),
    password: '',
  };

  constructor(
    private account: AccountService,
    private routee: ActivatedRoute
  ) {}
  @Input() email!: string;
  ngOnInit(): void {

    console.log(this.email);
    this.account
      .getUserByEmail('dlimiyassine13@gmail.com')
      .subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.log(err)
        }
      });
  }

  modifierUser() {
    this.account.updateUser(this.user).subscribe((res) => {
      console.log(res)
    });
  }
}
