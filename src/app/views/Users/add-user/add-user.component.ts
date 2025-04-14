import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { AddUser } from '../../../../models/add-user';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit{
  addUserForm: FormGroup;
 
  constructor(private userService: UserService) {
    this.addUserForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      userFirstName: new FormControl('', [Validators.required]),
      userLastName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', [Validators.required]),
      userPhone: new FormControl('', [Validators.required]),
      userRole: new FormControl('', [Validators.required]),
    });
  }
  
  ngOnInit(): void {}

  onSubmit(): void {
    this.addUser();
  }

  addUser(): void {
    if (this.addUserForm.valid) {
      const userData: AddUser = this.addUserForm.value;

      this.userService.addUser(userData).subscribe({
        next: (response) => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'User added successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.addUserForm.reset();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        },
      });
    }
  }

  
  get userName() {
    return this.addUserForm.get('userName');
  }

  get userFirstName() {
    return this.addUserForm.get('userFirstName');
  }

  get userLastName() {
    return this.addUserForm.get('userLastName');
  }

  get userEmail() {
    return this.addUserForm.get('userEmail');
  }

  get userPassword() {
    return this.addUserForm.get('userPassword');
  }

  get userPhone() {
    return this.addUserForm.get('userPhone');
  }

  get userRole() {
    return this.addUserForm.get('userRole');
  }
}