import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardsService } from '../shared/services/boards.service';
import { InlineFormModule } from '../shared/modules/inlineForm/inlineForm.module';
import { TopBarModule } from '../shared/modules/topbar/topbar.module';

@NgModule({
  imports: [CommonModule, RouterModule, InlineFormModule, TopBarModule],
  providers: [BoardsService],
  declarations: [BoardsComponent],
})
export class BoardsModule {}
