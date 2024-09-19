import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { BoardService } from '../../services/board.service';
import { TaskInterface } from '../../../shared/types/task.interface';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TasksService } from '../../../shared/services/tasks.service';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEventsEnum } from '../../../shared/types/socketEvent.enum';

@Component({
  selector: 'task-modal',
  templateUrl: './taskModal.component.html',
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{ task: TaskInterface; columns: ColumnInterface[] }>;
  columnForm: FormGroup;
  unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private tasksService: TasksService,
    private socketService: SocketService,
    private formBuilder: FormBuilder
  ) {
    this.columnForm = this.formBuilder.group({
      columnId: [null],
    });
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );

    this.data$ = combineLatest<[TaskInterface, ColumnInterface[]]>([
      this.task$,
      this.boardService.columns$,
    ]).pipe(
      map(([task, columns]) => ({
        task,
        columns,
      })),
      tap(({ task }) => this.columnForm.patchValue({ columnId: task.columnId }))
    );

    this.data$.pipe(takeUntil(this.unsubscribe$)).subscribe(({ task }) => {
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    if (!boardId) {
      throw new Error('Cannot get board ID from URL');
    }

    if (!taskId) {
      throw new Error('Cannot get task ID from URL');
    }

    this.taskId = taskId;
    this.boardId = boardId;

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId !== columnId) {
          this.tasksService.updateTask(this.boardId, task.id, { columnId });
        }
      });

    this.socketService
      .listen<string>(SocketEventsEnum.TaskDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.goToBoard());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });
  }

  updateTaskDescription(taskDescription: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: taskDescription,
    });
  }

  deleteTask(): void {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }
}
