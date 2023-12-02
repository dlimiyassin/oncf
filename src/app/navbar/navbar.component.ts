import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public loggedIn: boolean = false;
  public userInfos: any = null;
  constructor(
    public authservice: AuthService,
    private router: Router,
    private account: AccountService,
    private token: TokenService
  ) {}

  ngOnInit(): void {
    this.account.authStatus.subscribe((value) => {
      this.loggedIn = value;
      this.userInfos = this.token.getInfos();
    });
  }
  handleLogout() {
    this.token.remove();
    this.account.changeAuthStatus(false);
    this.router.navigateByUrl('/');
  }
}