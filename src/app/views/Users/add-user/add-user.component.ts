import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { AddUser } from '../../../../models/add-user';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit{
  addUserForm: FormGroup;
 
  constructor(private userService: UserService) {
    this.addUserForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
      ]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]),    
      address: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    });
  }
  
  ngOnInit(): void {}

  onSubmit(): void {
    console.log(this.addUserForm.value);
    if (this.addUserForm.valid) {
      const userData: AddUser = this.addUserForm.value;
      const role = this.addUserForm.value.role;

      if (role === 'Client') {
        this.userService.addUser(userData).subscribe({
          next: () => this.showSuccess('Client added successfully'),
          error: (error) => console.error('Error adding Customer:', error),
        });
      } else if (role === 'Supplier') {
        this.userService.addUser(userData).subscribe({
          next: () => this.showSuccess('Supplier added successfully'),
          error: (error) => console.error('Error adding supplier:', error),
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Role',
          text: 'Please select either Client or Supplier'
        });
      }
    }
  }

  showSuccess(message: string) {
    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2500,
    });
    this.addUserForm.reset();
  }


  // addUser(): void {
  //   if (this.addUserForm.valid) {
  //     const userData: AddUser = this.addUserForm.value;

  //     this.userService.addUser(userData).subscribe({
  //       next: (response) => {
  //         Swal.fire({
  //           toast: true,
  //           position: 'top',
  //           icon: 'success',
  //           title: 'User added successfully',
  //           showConfirmButton: false,
  //           timer: 2500,
  //         });
  //         this.addUserForm.reset();
  //       },
  //       error: (error) => {
  //         console.error('Error adding user:', error);
  //       },
  //     });
  //   }
  // }

  
  get userName() {
    return this.addUserForm.get('userName');
  }

  get firstName() {
    return this.addUserForm.get('firstName');
  }

  get lastName() {
    return this.addUserForm.get('lastName');
  }

  get email() {
    return this.addUserForm.get('email');
  }

  get userPassword() {
    return this.addUserForm.get('userPassword');
  }
  // get rePassword() {
  //   return this.addUserForm.get('rePassword');
  // }

  get phoneNumber() {
    return this.addUserForm.get('phoneNumber');
  }
  get address() {
    return this.addUserForm.get('address');
  }

  get role() {
    return this.addUserForm.get('role');
  }
}