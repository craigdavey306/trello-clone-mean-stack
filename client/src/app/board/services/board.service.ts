import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardInterface } from '../../shared/types/board.interface';
import { SocketService } from '../../shared/services/socket.service';
import { SocketEventsEnum } from '../../shared/types/socketEvent.enum';
import { ColumnInterface } from '../../shared/types/column.interface';
import { TaskInterface } from '../../shared/types/task.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);

  constructor(private socketService: SocketService) {}

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.BoardsLeave, { boardId });
  }

  updateBoard(updatedBoard: BoardInterface): void {
    const board = this.board$.getValue();
    if (!board) {
      throw new Error('Board is not initialized');
    }

    this.board$.next({ ...board, title: updatedBoard.title });
  }

  setColumns(columns: ColumnInterface[]): void {
    this.columns$.next(columns);
  }

  addColumn(column: ColumnInterface): void {
    const updatedColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updatedColumns);
  }

  setTasks(tasks: TaskInterface[]): void {
    this.tasks$.next(tasks);
  }

  addTask(task: TaskInterface): void {
    const updatedTasks = [...this.tasks$.getValue(), task];
    this.tasks$.next(updatedTasks);
  }
}
