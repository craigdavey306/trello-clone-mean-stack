import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardInterface } from '../types/board.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvent.enum';

@Injectable()
export class BoardsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getBoards(): Observable<BoardInterface[]> {
    const url = `${environment.apiUrl}/boards`;
    return this.http.get<BoardInterface[]>(url);
  }

  getBoard(boardId: string): Observable<BoardInterface> {
    const url = `${environment.apiUrl}/board/${boardId}`;
    return this.http.get<BoardInterface>(url);
  }

  createBoard(title: string): Observable<BoardInterface> {
    const url = `${environment.apiUrl}/boards`;
    return this.http.post<BoardInterface>(url, { title });
  }

  updateBoard(boardId: string, fields: { title: string }): void {
    this.socketService.emit(SocketEventsEnum.BoardsUpdate, { boardId, fields });
  }

  deleteBoard(boardId: string): void {
    this.socketService.emit(SocketEventsEnum.BoardsDelete, { boardId });
  }
}
