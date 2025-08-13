import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7194/api'; // Update with your backend URL
  private tokenKey = 'auth_token';
  private userKey = 'user_info';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  public currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/Auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.isAuthenticatedSubject.next(true);
          this.currentUser.set(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = localStorage.getItem(this.userKey);

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        this.isAuthenticatedSubject.next(true);
        this.currentUser.set(parsedUser);
      } catch (error) {
        // If JSON parsing fails, clear invalid data
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
