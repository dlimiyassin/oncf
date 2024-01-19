import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { TokenService } from '../services/token.service';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { EmployeService } from '../services/employe.service';
import { Employe } from '../models/employe.model';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  public loggedIn: boolean = false;
  public tokenInfos: any = null;
  user!: User;
  employes: Employe[] = [];
  constructor(
    public authservice: AuthService,
    private router: Router,
    private account: AccountService,
    private token: TokenService,
    private toaster: ToastrService,
    private employe: EmployeService,
    private datePipe: DatePipe
  ) {}

  private ngUnsubscribe = new Subject<void>();
  ngOnInit(): void {
    this.account.authStatus
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.loggedIn = value;
        this.tokenInfos = this.token.getInfos();
      });

    this.employe
      .getAllNotifications()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (employes) => {
          this.employes = employes.map(
            (data) =>
              new Employe(
                data.id,
                data.cni,
                data.firstname,
                data.lastname,
                data.email,
                new Date(data.birthDate),
                data.rendement,
                data.objectif,
                data.atteint,
                new Date(data.retraite),
                data.performanceComment
              )
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.getImage();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  handleLogout() {
    this.token.remove();
    this.account.changeAuthStatus(false);
    this.router.navigateByUrl('/');
    this.toaster.success('You logged out successfully', 'Success', {
      timeOut: 1000,
    });
  }

  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  timeLeftValue(date: Date): string {
    return this.employe.timeLeft(date);
  }
  /*----------------- get profile picture ------------------*/
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any;

  getImage() {
    this.account.getImage(this.tokenInfos.sub).subscribe({
      next: (res) => {
        this.retrieveResponse = res;
        this.base64Data = this.retrieveResponse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
