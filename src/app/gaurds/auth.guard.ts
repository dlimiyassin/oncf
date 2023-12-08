import {
  CanActivateFn,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from './../services/token.service';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(TokenService).loggedIn()){
   inject(TokenService).remove();
     inject(AccountService).changeAuthStatus(false);
     inject(Router).navigateByUrl('/login');
     return false;
  }

  return true;
};
