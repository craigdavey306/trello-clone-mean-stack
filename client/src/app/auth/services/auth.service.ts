import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrentUser, RegisterRequest, LoginRequest } from '../types';
import { SocketService } from '../../shared/services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUser | null | undefined>(undefined);
  isLoggedIn$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map(Boolean)
  );

  constructor(private http: HttpClient, private socketService: SocketService) {}

  getCurrentUser(): Observable<CurrentUser> {
    const url = `${environment.apiUrl}/user`;
    return this.http.get<CurrentUser>(url);
  }

  setCurrentUser(currentUser: CurrentUser | null): void {
    this.currentUser$.next(currentUser);
  }

  register(registerRequest: RegisterRequest): Observable<CurrentUser> {
    const url = `${environment.apiUrl}/users`;
    return this.http.post<CurrentUser>(url, registerRequest);
  }

  login(loginRequest: LoginRequest): Observable<CurrentUser> {
    const url = `${environment.apiUrl}/users/login`;
    return this.http.post<CurrentUser>(url, loginRequest);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
    this.socketService.disconnect();
  }

  setToken(currentUser: CurrentUser): void {
    localStorage.setItem('token', currentUser.token);
  }

  setupSocketConnection(currentUser: CurrentUser) {
    this.socketService.setupSocketConnection(currentUser);
  }
}
