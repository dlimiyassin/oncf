import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auths/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './auths/register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebareComponent } from './sidebare/sidebare.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerificationEmailComponent } from './email-verification/verification-message/verification-email.component';
import { SuccessMessageComponent } from './email-verification/success-message/success-message.component';
import { FailMessageComponent } from './email-verification/fail-message/fail-message.component';
import { EmployeComponent } from './employe/employe.component';
import { DatePipe } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { JwtInterceptor } from './services/jwt.interceptor';
import { ForgetPasswordComponent } from './email-verification/forget-password/forget-password.component';
import { AskForEmailComponent } from './email-verification/ask-for-email/ask-for-email.component';
import { NewPasswordComponent } from './email-verification/new-password/new-password.component';
import { ToastrModule } from 'ngx-toastr';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContratNotificationComponent } from './contrat-notification/contrat-notification.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { QuizRhComponent } from './quiz-rh/quiz-rh.component';
import { QuizEmployeComponent } from './quiz-employe/quiz-employe.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent,
    SidebareComponent,
    VerificationEmailComponent,
    SuccessMessageComponent,
    FailMessageComponent,
    EmployeComponent,
    ProfileComponent,
    ForgetPasswordComponent,
    AskForEmailComponent,
    NewPasswordComponent,
    ContratNotificationComponent,
    DashboardLayoutComponent,
    QuizRhComponent,
    QuizEmployeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbDatepickerModule,
    BrowserAnimationsModule,
    NgbAccordionModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
