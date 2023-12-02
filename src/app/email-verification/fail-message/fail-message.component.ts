import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fail-message',
  templateUrl: './fail-message.component.html',
  styleUrls: ['./fail-message.component.css'],
})
export class FailMessageComponent implements OnInit{
  constructor(private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.router.navigateByUrl('/login');
  }
}
