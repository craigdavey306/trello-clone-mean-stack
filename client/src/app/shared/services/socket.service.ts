import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { CurrentUser } from '../../auth/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket | undefined;

  setupSocketConnection(currentUser: CurrentUser): void {
    if (this.socket) return;
    this.socket = io(environment.socketUrl, {
      auth: {
        token: currentUser.token,
      },
    });
  }

  disconnect(): void {
    if (!this.socket) {
      throw new Error('Socket connection was not established.');
    }

    this.socket.disconnect();
  }

  emit(eventName: string, message: unknown): void {
    if (!this.socket) {
      throw new Error('Socket connection was not established.');
    }

    this.socket.emit(eventName, message);
  }

  listen<T>(eventName: string): Observable<T> {
    const socket = this.socket;

    if (!socket) {
      throw new Error('Socket connection was not established.');
    }

    return new Observable((subscriber) => {
      socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
}
