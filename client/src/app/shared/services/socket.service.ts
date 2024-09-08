import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CurrentUser } from '../../auth/types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket | undefined;

  setupSocketConnection(currentUser: CurrentUser): void {
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
}
