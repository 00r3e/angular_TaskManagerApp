import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterUser } from '../models/register-user';
import { Observable } from 'rxjs';
import { LoginUser } from '../models/login-user';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  public currentUserName: string | null = null;

  public postRegister(registerUser: RegisterUser): Observable<any> {
    return this.http.post<RegisterUser>('/api/account', registerUser);
  }

  public postLogin(loginUser: LoginUser): Observable<any> {
    return this.http.post<any>('/api/account/login', loginUser);
  }

  public getLogout(): Observable<string> {
    return this.http.get<string>('/api/account/logout', { responseType: 'text' as 'json' });
  }

  public postGenerateNewToken(): Observable<any> {
    var token = localStorage['token'];
    var refreshToken = localStorage['refreshToken'];
    return this.http.post<any>('/api/account/generate-new-jwt-token', {token: token, refreshToken: refreshToken});
  }

}
