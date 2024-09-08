import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { RouterModule } from '@angular/router';
import { BoardService } from './services/board.service';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [BoardComponent],
  providers: [BoardService],
})
export class BoardModule {}
