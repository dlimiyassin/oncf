import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerificationEmailComponent } from './email-verification/verification-message/verification-email.component';
import { SuccessMessageComponent } from './email-verification/success-message/success-message.component';
import { FailMessageComponent } from './email-verification/fail-message/fail-message.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verification', component: VerificationEmailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'success', component: SuccessMessageComponent},
  { path: 'fail', component: FailMessageComponent},
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
