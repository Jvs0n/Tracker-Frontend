import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {User} from '../../models/user';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user = new BehaviorSubject<User | undefined>(this.loadUserFromSessionStorage());
  user$ = this.user.asObservable();
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private router: Router) {
  }
  private loadUserFromSessionStorage(): User | undefined {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : undefined;
  }
  getUserId(): number | undefined {
    return this.user.value?.id;
  }
  isLoggedIn(): boolean {
    return !!this.user.value;
  }

  isAdmin(): boolean {
    return this.user.value?.isAdmin ?? false;
  }

  login(username: string, password: string): Observable<User | undefined> {
    console.log('Login request sent with:', { username, password });
    return new Observable(subscriber => {
      this.http.post<User>(`${this.apiUrl}/login/`, { username, password }).pipe(
        catchError(error => {

          console.error('Login request failed:', error);
          subscriber.next(undefined);
          return of(undefined);
        })
      ).subscribe({
        next: user => {
          if (user) {
            if (user.username == "admin") {
              user.isAdmin = true;
            }
            sessionStorage.setItem('user', JSON.stringify(user));
            this.user.next(user);
            console.log('Login successful:', user);
          } else {
            console.log('Login failed: Invalid credentials');
          }
          subscriber.next(user);
        },
        error: (err) => {
          console.error('Error in login subscription:', err);
          subscriber.next(undefined);
        },
        complete: () => {
          console.log('Login attempt completed');
          subscriber.complete();
        }
      });
    });
  }

  register(data: any): Observable<User | undefined> {
    console.log('Register request sent with:', data);

    return new Observable(subscriber => {
      this.http.post<any>(`${this.apiUrl}/register/`, data).pipe(
        catchError(error => {
          console.error('Registration request failed:', error);
          subscriber.next(undefined);
          return of(undefined);
        })
      ).subscribe({
        next: () => {
        },
        error: err => {
          console.error('Error during registration subscription:', err);
          subscriber.next(undefined);
        },
        complete: () => {
          console.log('Registration attempt completed');
        }
      });
    });
  }
  logout(): void {
    console.log('User logged out');
    sessionStorage.removeItem('user');
    this.user.next(undefined);
    this.router.navigate(['/']).then();
  }




}
