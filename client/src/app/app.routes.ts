import { Routes } from '@angular/router';
import { authGuardCanActivate } from './auth/guards/auth.guard';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './home/components/home/home.component';
import { BoardsComponent } from './boards/components/boards/boards.component';
import { BoardComponent } from './board/components/board/board.component';
import { TaskModalComponent } from './board/components/taskModal/taskModal.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [() => authGuardCanActivate],
  },
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [() => authGuardCanActivate],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      },
    ],
  },
];
