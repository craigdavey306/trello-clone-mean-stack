import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnInterface } from '../types/column.interface';
import { environment } from '../../../environments/environment';
import { ColumnInputInterface } from '../types/columnInput.interface';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvent.enum';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient, private socketService: SocketService) {
    console.log('socket svc', socketService);
  }

  getColumns(boardId: string): Observable<ColumnInterface[]> {
    const url = `${environment.apiUrl}/board/${boardId}/columns`;
    return this.http.get<ColumnInterface[]>(url);
  }

  createColumn(columnInput: ColumnInputInterface): void {
    this.socketService.emit(SocketEventsEnum.ColumnCreate, columnInput);
  }

  updateColumn(
    boardId: string,
    columnId: string,
    fields: { title: string }
  ): void {
    this.socketService.emit(SocketEventsEnum.ColumnUpdate, {
      boardId,
      columnId,
      fields,
    });
  }

  deleteColumn(boardId: string, columnId: string): void {
    this.socketService.emit(SocketEventsEnum.ColumnDelete, {
      boardId,
      columnId,
    });
  }
}
