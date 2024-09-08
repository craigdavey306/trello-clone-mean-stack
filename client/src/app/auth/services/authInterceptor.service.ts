import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Authorization middleware
 */
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token') ?? '';
    const authReq = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });

    return next.handle(authReq);
  }
}
