import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ask-for-email',
  templateUrl: './ask-for-email.component.html',
  styleUrls: ['./ask-for-email.component.css']
})
export class AskForEmailComponent {
constructor(private service : AuthService, private router : Router){}

  email! : '';
  forget(){
    this.service.forgetPassword(this.email).subscribe({
      next: (data) => { console.log(data)},
      error: (err) => { console.log(err) }
    });
    this.router.navigateByUrl('/forget-password');
  }
}
