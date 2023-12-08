import {
  CanActivateFn,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from './../services/token.service';
import { Router } from '@angular/router';
export const afterAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (inject(TokenService).loggedIn()) {
    inject(Router).navigateByUrl('/dashboard');
    return false;
  }

  return true;
};
