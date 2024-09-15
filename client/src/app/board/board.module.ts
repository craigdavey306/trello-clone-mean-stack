import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { RouterModule } from '@angular/router';
import { BoardService } from './services/board.service';
import { ColumnsService } from '../shared/services/columns.service';
import { TopBarModule } from '../shared/modules/topbar/topbar.module';
import { InlineFormModule } from '../shared/modules/inlineForm/inlineForm.module';
import { TasksService } from '../shared/services/tasks.service';

@NgModule({
  imports: [CommonModule, RouterModule, TopBarModule, InlineFormModule],
  declarations: [BoardComponent],
  providers: [BoardService, ColumnsService, TasksService],
})
export class BoardModule {}
