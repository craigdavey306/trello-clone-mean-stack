import { Component, OnInit } from '@angular/core';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import { BoardInterface } from '../../../shared/types/board.interface';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEventsEnum } from '../../../shared/types/socketEvent.enum';
import { ColumnsService } from '../../../shared/services/columns.service';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { ColumnInputInterface } from '../../../shared/types/columnInput.interface';
import { TaskInterface } from '../../../shared/types/task.interface';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskInputInterface } from '../../../shared/types/taskInput.interface';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private tasksService: TasksService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error('Cannot get board ID from url.');
    }

    this.boardId = boardId;
    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      map(([board, columns, tasks]) => {
        return {
          board,
          columns,
          tasks,
        };
      })
    );
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.BoardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    // listener for column create success
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.ColumnCreateSuccess)
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });

    // listener for task create success
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.TaskCreateSuccess)
      .subscribe((task) => {
        this.boardService.addTask(task);
      });

    // listener for board update success
    this.socketService
      .listen<BoardInterface>(SocketEventsEnum.BoardsUpdateSuccess)
      .subscribe((updatedBoard) => this.boardService.updateBoard(updatedBoard));
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });

    this.columnsService.getColumns(this.boardId).subscribe((columns) => {
      this.boardService.setColumns(columns);
    });

    this.tasksService.getTasks(this.boardId).subscribe((tasks) => {
      this.boardService.setTasks(tasks);
    });
  }

  createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };

    this.columnsService.createColumn(columnInput);
  }

  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }

  createTask(title: string, columnId: string): void {
    const taskInput: TaskInputInterface = {
      title,
      boardId: this.boardId,
      columnId,
    };

    this.tasksService.createTask(taskInput);
  }

  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }
}
