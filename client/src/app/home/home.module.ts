import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
