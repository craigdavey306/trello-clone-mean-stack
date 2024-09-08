import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  errorMessage: string | null = null;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.authService.login(this.form.value).subscribe({
      next: (currentUser) => {
        console.log('currentUser', currentUser);
        this.authService.setToken(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        const errors: string[] = [];
        if (typeof err.error === 'object') {
          if (!Array.isArray(err.error)) {
            Object.values(err.error).forEach((e) => errors.push(e as string));
          } else {
            err.error.forEach((e) => errors.push(e));
          }
        }

        this.errorMessage = errors.join(', ');
      },
    });
  }
}
