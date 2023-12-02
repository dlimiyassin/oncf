import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.css'],
})
export class VerificationEmailComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.router.navigateByUrl("/login");
  }
}
