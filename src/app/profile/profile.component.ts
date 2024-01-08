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
  constructor(
    private account: AccountService,
    private auth: AuthService,
    private token: TokenService,
    private routee: ActivatedRoute,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}

  @Input() email!: string; // retreive email value from the path

  /*-------------------------------- fetch user data --------------------------*/
  user: User = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    birthdate: new Date(),
    image: '',
  };

  ngOnInit(): void {
    console.log(this.email);
    this.account.getUserByEmail(this.email).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.getImage();
  }

  /*-------------------------------- upload image --------------------------*/
  selectedFile!: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any;
  public onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onUpload() {
    console.log(this.selectedFile);
    const uploadImageData = new FormData();
    uploadImageData.append(
      'imageFile',
      this.selectedFile,
      this.selectedFile.name
    );

    this.account.uploadImage(uploadImageData, this.user.email).subscribe({
      next: (res) => {
          this.toastr.success('Image uploaded successfully', 'Success', { timeOut: 3000 });        
      },
      error: (err) => {        
          this.toastr.success('Image uploaded successfully', 'Success', { timeOut: 3000 });  
      }
    });
  }

  getImage() {
    this.account.getImage(this.email).subscribe({
      next: (res) => {
        console.log(res);
        this.retrieveResponse = res;
        this.base64Data = this.retrieveResponse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removePicture() {
    this.account.removePicture(this.user.email).subscribe({
      next: (res) => {
        this.toastr.success('Image removed successfully', 'Success', { timeOut: 3000 });  
      },
      error: (err) => {
               
          this.toastr.error('Image not uploaded successfully', 'Error', { timeOut: 3000 });
      },
    });
  }
  /*-------------------------------- format date --------------------------*/
  formatDate(date: Date | null): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  onBirthDateInput(event: any) {
    this.user.birthdate = new Date(event.target.value);
  }
  /*-------------------------------- update user details --------------------------*/
  modifierUser() {
    this.account.updateUser(this.user).subscribe((res) => {
      console.log(res);
      this.toastr.success('Profile updated successfully', 'Success', { timeOut: 3000  });
    });
  }

  /*-------------------------------- update user password --------------------------*/
  updatePwd: any = {
    oldPassword: '',
    newPassword: '',
    renewPassword: '',
    username: '',
  };
  updateResultMessage: string | null = null;
  updatePassword() {
    if (this.updatePwd.newPassword == this.updatePwd.renewPassword) {
      this.updatePwd.username = this.token.getInfos()?.sub;
      this.auth.updateProfilePassword(this.updatePwd).subscribe({
        next: (data) => {
          this.toastr.success('Your password has been updated successfully','Success',{ timeOut: 3000 });
          console.log(data);
        },
        error: (err) => {
          this.toastr.error('The old password is not correct', 'Error', { timeOut: 3000, });
          console.log(err);
        },
      });
    } else {
      this.toastr.warning(
        'The new password should match the renew password','Warning', { timeOut: 3000 });
    }
  }
}
