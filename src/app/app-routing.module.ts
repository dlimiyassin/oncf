import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auths/login/login.component';
import { RegisterComponent } from './auths/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerificationEmailComponent } from './email-verification/verification-message/verification-email.component';
import { SuccessMessageComponent } from './email-verification/success-message/success-message.component';
import { FailMessageComponent } from './email-verification/fail-message/fail-message.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './gaurds/auth.guard';
import { afterAuthGuard } from './gaurds/after-auth.guard';
import { ForgetPasswordComponent } from './email-verification/forget-password/forget-password.component';
import { AskForEmailComponent } from './email-verification/ask-for-email/ask-for-email.component';
import { NewPasswordComponent } from './email-verification/new-password/new-password.component';
import { ContratNotificationComponent } from './contrat-notification/contrat-notification.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { QuizRhComponent } from './quiz-rh/quiz-rh.component';
import { QuizEmployeComponent } from './quiz-employe/quiz-employe.component';


const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Oncf', canActivate: [afterAuthGuard] },
  { path: 'login', component: LoginComponent, title: 'Login', canActivate: [afterAuthGuard] },
  { path: 'register', component: RegisterComponent, title: 'Register', canActivate: [afterAuthGuard] },
  { path: 'quiz-employe', component: QuizEmployeComponent, title: 'Quiz' },

  { path: 'verification', component: VerificationEmailComponent },
  { path: 'success', component: SuccessMessageComponent },
  { path: 'fail', component: FailMessageComponent },

  { path: 'ask-email', component: AskForEmailComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'new-password/:email', component: NewPasswordComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent, title: 'Dashboard' },
      { path: 'profile/:email', component: ProfileComponent , title: 'Profile'},
      { path: 'contrat', component: ContratNotificationComponent , title: 'Notification'},
      { path: 'quiz-rh', component: QuizRhComponent , title: 'RH'},
      { path: 'quiz-employe', component: QuizEmployeComponent , title: 'Quiz'},
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
