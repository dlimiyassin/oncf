import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    private account: AccountService,
    private auth: AuthService,
    private token: TokenService,
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

  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.getImage();
    this.account
      .getUserByEmail(this.email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (user) => {
          this.user = user;
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  /*-------------------------------- upload image --------------------------*/
  selectedFile!: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any;
  public onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getImage() {
    this.account
      .getImage(this.email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
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
  onUpload() {
    const uploadImageData = new FormData();
    uploadImageData.append(
      'imageFile',
      this.selectedFile,
      this.selectedFile.name
    );

    this.account
      .uploadImage(uploadImageData, this.user.email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.getImage();
          this.toastr.success('Image uploaded successfully', 'Success', {
            timeOut: 3000,
          });
        },
        error: (err) => {
          this.toastr.error('Image does not uploaded successfully', 'error', {
            timeOut: 3000,
          });
        },
      });
  }
  removePicture() {
    this.account
      .removePicture(this.user.email)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.retrievedImage = '';
          this.toastr.success('Image removed successfully', 'Success', {
            timeOut: 3000,
          });
        },
        error: (err) => {
          this.toastr.error('Image not uploaded successfully', 'Error', {
            timeOut: 3000,
          });
        },
      });
    this.getImage()
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
    this.account
      .updateUser(this.user)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.toastr.success('Profile updated successfully', 'Success', {
          timeOut: 3000,
        });
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
      this.auth
        .updateProfilePassword(this.updatePwd)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (data) => {
            this.toastr.success(
              'Your password has been updated successfully',
              'Success',
              { timeOut: 3000 }
            );
          },
          error: (err) => {
            this.toastr.error('The old password is not correct', 'Error', {
              timeOut: 3000,
            });
            console.log(err);
          },
        });
    } else {
      this.toastr.warning(
        'The new password should match the renew password',
        'Warning',
        { timeOut: 3000 }
      );
    }
  }
}
