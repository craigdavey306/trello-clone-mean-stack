import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { HomeModule } from './home/home.module';
import { BoardsModule } from './boards/boards.module';
import { BoardsService } from './shared/services/boards.service';
import { BoardModule } from './board/board.module';
import { SocketService } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthModule, HomeModule, BoardsModule, BoardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [BoardsService, SocketService],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
      },
      error: (err) => {
        this.authService.setCurrentUser(null);
      },
    });
  }
}
