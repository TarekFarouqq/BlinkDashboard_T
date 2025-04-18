import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
 import { AddAdmin } from '../../../../models/add-admin';  
 


@Component({
  selector: 'app-add-admin',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.scss'
})
export class AddAdminComponent implements OnInit{

  addAdminForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    this.addAdminForm = this.fb.group({
      userName: ['', Validators.required],
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
      ]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      rePassword: ['', Validators.required]
    }, 
    { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('rePassword')!.value
      ? null : { 'mismatch': true };
  }

  get userName() { return this.addAdminForm.get('userName'); }
  get fName() { return this.addAdminForm.get('fName'); }
  get lName() { return this.addAdminForm.get('lName'); }
  get email() { return this.addAdminForm.get('email'); }
  get password() { return this.addAdminForm.get('password'); }
  get rePassword() { return this.addAdminForm.get('rePassword'); }
 
  get phoneNumber() { return this.addAdminForm.get('phoneNumber'); }
  get address() { return this.addAdminForm.get('address'); }

  serverError: string = '';
  onSubmit(): void {
    if (this.addAdminForm.valid) {
      const admin: AddAdmin = {
        userName: this.addAdminForm.value.userName,
        fName: this.addAdminForm.value.fName,
        lName: this.addAdminForm.value.lName,
        email: this.addAdminForm.value.email,
        password: this.addAdminForm.value.password,
        rePassword: this.addAdminForm.value.rePassword,
        phoneNumber: this.addAdminForm.value.phoneNumber,
        address: this.addAdminForm.value.address,
         
      };

      this.userService.addAdmin(admin).subscribe({
        next: res => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Admin added successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.router.navigate(['/Users/manage']);
        },
        error: err => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Failed to add admin',
            text: err.error?.message || 'Something went wrong!',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }
}