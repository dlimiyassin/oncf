import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
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
  };

  updatePwd: any = {
    oldPassword: '',
    newPassword: '',
    renewPassword: '',
    username: '',
  };

  constructor(
    private account: AccountService,
    private auth: AuthService,
    private token: TokenService,
    private routee: ActivatedRoute,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}
  @Input() email!: string;
  ngOnInit(): void {
    console.log(this.email);
    this.account.getUserByEmail('dlimiyassine13@gmail.com').subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  modifierUser() {
    this.account.updateUser(this.user).subscribe((res) => {
      console.log(res);
      this.toastr.success('Profile updated successfully', 'Success', { timeOut: 3000 });
    });
  }
  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }
  updateResultMessage: string | null = null;
  updatePassword() {
    if (this.updatePwd.newPassword == this.updatePwd.renewPassword) {
      this.updatePwd.username = this.token.getInfos()?.sub;
      this.auth.updateProfilePassword(this.updatePwd).subscribe({
        next: (data) => {

        this.toastr.success("Your password has been updated successfully", 'Success', { timeOut: 3000 });
          console.log(data)
        },
        error: (err) => {

          this.toastr.error("The old password is not correct", 'Error', { timeOut: 3000 });

          console.log(err);
        },
      });
    } else {
      this.toastr.warning('The new password should match the renew password', 'Warning', { timeOut: 3000 });
    }
  }
}
