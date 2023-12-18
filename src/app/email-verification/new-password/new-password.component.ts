import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent implements OnInit {
  constructor(
    private service: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  updatePwd: any = {
    email: '',
    password: '',
    renewPassword: '',
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.updatePwd.email = params['email'];
    });
  }

  errorMesaage! : string;
  update() {
    if (this.updatePwd.password == this.updatePwd.renewPassword) {
      this.service.updatePassword(this.updatePwd).subscribe({
        next: (data) => {
          console.log(data);
          alert('Congrats! your password has been updated');
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.errorMesaage="make sure to comfirm your password correctly"
    }

  }
}
