/** Deprecated  - Do not use*/

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * @deprecated
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log('can activate', this.authService);
    return this.authService.isLoggedIn$
      .pipe(
        map((isLoggedIn) => {
          if (isLoggedIn) {
            return true;
          }

          // this.router.navigateByUrl('/');
          this.router.navigate(['/']);
          return false;
        })
      )
      .pipe(tap((value) => console.log('guard', value)));
  }
}
