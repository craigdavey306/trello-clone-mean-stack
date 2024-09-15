import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

/**
 * Logic to determine whether whether the user is logged in to the application.
 * @param route Activated route snapshot
 * @param state Router state snapshot
 * @returns Returns true if the user is logged in, or returns a url tree for redirecting
 * the user if not currently signed in.
 */
export const authGuardCanActivate: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }

      const router = inject(Router);
      const urlTree: UrlTree = router.parseUrl('/');
      return urlTree;
    })
  );
};
