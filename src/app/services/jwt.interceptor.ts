import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private tokkenService: TokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

  if (!request.url.includes('/auth')) {
    let newRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        'Bearer ' + this.tokkenService.getToken()
      ),
    });
    return next.handle(newRequest);
  } else  return next.handle(request);
  }
}
