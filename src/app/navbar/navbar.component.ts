import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { TokenService } from '../services/token.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public loggedIn: boolean = false;
  public tokenInfos: any = null;
  user!: User;
  constructor(
    public authservice: AuthService,
    private router: Router,
    private account: AccountService,
    private token: TokenService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.account.authStatus.subscribe((value) => {
      this.loggedIn = value;
      this.tokenInfos = this.token.getInfos();
    });
    
  }
  handleLogout() {
    this.token.remove();
    this.account.changeAuthStatus(false);
    this.router.navigateByUrl('/');
  }
  profile() {}
}