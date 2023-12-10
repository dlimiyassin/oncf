import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateFn } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerificationEmailComponent } from './email-verification/verification-message/verification-email.component';
import { SuccessMessageComponent } from './email-verification/success-message/success-message.component';
import { FailMessageComponent } from './email-verification/fail-message/fail-message.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './gaurds/auth.guard';
import { afterAuthGuard } from './gaurds/after-auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [afterAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [afterAuthGuard] },
  { path: 'register', component: RegisterComponent , canActivate: [afterAuthGuard]},
  
  { path: 'verification', component: VerificationEmailComponent },
  { path: 'success', component: SuccessMessageComponent },
  { path: 'fail', component: FailMessageComponent },
  {
    path: 'dashboard',
    children: [
      { path: '', component: DashboardComponent },
      { path: 'profile/:email', component: ProfileComponent },
    ],
    canActivate: [authGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    bindToComponentInputs: true
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
