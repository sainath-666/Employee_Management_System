import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/employee.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'user_info';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  public currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    try {
      const token = this.getToken();
      const user = this.getUser();

      if (token && user) {
        // Validate token with backend
        this.http.get(`${this.API_URL}/Auth/validate`).subscribe({
          next: () => {
            this.isAuthenticatedSubject.next(true);
            this.currentUser.set(user);
          },
          error: () => {
            // If token validation fails, clear auth state
            this.logout();
          },
        });
      } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUser.set(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.isAuthenticatedSubject.next(false);
      this.currentUser.set(null);
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private getUser(): any {
    try {
      const userStr = localStorage.getItem(this.userKey);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  private setUser(user: any): void {
    try {
      if (user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.userKey);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
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
}
