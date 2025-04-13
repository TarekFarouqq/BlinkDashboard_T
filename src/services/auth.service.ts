import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  userData: any;
  private userIsLoggedIn=new BehaviorSubject<boolean>(this.hasToken());

  private userRoleSubject = new BehaviorSubject<string | null>(this.getUserRoleFromToken());
  userRole$ = this.userRoleSubject.asObservable();
  
  constructor(private _HttpClient: HttpClient,private _Router:Router) {}

  setRegister(userData: object): Observable<any> {
    return this._HttpClient.post(
      `
      ${this.apiUrl}/account/RegisterClient`,
      userData
    );
  }


  setSupRegister(userData: object): Observable<any> {
    return this._HttpClient.post(
      `
      ${this.apiUrl}/Account/RegisterSupplier`,
      userData
    );
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return (
      decodedToken?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] || null
    );
  }

   getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  setUserRole() {
    const role = this.getUserRoleFromToken();
    this.userRoleSubject.next(role);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    if (!token) return false;

    const helper = new JwtHelperService();
    if (helper.isTokenExpired(token)) {
      localStorage.removeItem('token');
    return false;
    }

    return true;
  }

  login(userData: object): Observable<any> {
    return this._HttpClient.post(
      `${this.apiUrl}/account/LoginAccount`,
      userData
    );
  }

  Logout(): void {
    this.userLogout();
    localStorage.removeItem('token');
    this.userData = null;
    this._Router.navigate(['/login']);
    
  }


  // New Auth..

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const helper = new JwtHelperService();
    if (helper.isTokenExpired(token)) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.userIsLoggedIn.asObservable();
  }

  userLogin(){
    this.userIsLoggedIn.next(true);
  }
  userLogout(){
    this.userIsLoggedIn.next(false);
    this.userRoleSubject.next(null);
  }

  // forget pass in api => account/forgetPassward enter email to send el code : 
  resetPassword(email: string): Observable<any> {
    return this._HttpClient.post(`${this.apiUrl}/account/forgetPassward`, { email });
  }
// verify code :      :: check api ::
  verifyCode(code: { code: string }): Observable<any> {
    return this._HttpClient.post(`${this.apiUrl}/account/verifyCode`, code);
  }

// set new password :     :: check api ::
setNewPassword(data: { newPassword: string }): Observable<any> {
  return this._HttpClient.post(`${this.apiUrl}/account/setNewPassword`, data);
}

}
