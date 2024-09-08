import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  providers: [AuthService],
  declarations: [RegisterComponent, LoginComponent],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class AuthModule {}
