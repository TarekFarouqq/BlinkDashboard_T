import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  msgerror: string = '';
  isLoading: boolean = false;

  loginForm: FormGroup = new FormGroup({
    identifier: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8), 
      Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$') 
    ])
  });
  constructor(private _AuthService: AuthService, private _Router: Router) {}

  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const loginData = {
        email: this.loginForm.value.identifier,  
        password: this.loginForm.value.password
      };
  
      this._AuthService.login(loginData).subscribe({
        next: (response) => {
          console.log("Login Response:", response);
          if (response.token) {
            localStorage.setItem('token', response.token);
            this._AuthService.userLogin();
            this._AuthService.setUserRole();
            this.isLoading = false;
            this._Router.navigateByUrl('/dashboard');
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.log(err);
          this.msgerror = err.error.message;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
