import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddUser } from '../../../../models/add-user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../../../models/User';
 


@Component({
  selector: 'app-update',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit {
  updateUserForm!: FormGroup;
  userId!: string;
  user!: AddUser;
  
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.updateUserForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [ Validators.required,Validators.minLength(3),Validators.maxLength(15) ]),
      lastName: new FormControl('', [ Validators.required,Validators.minLength(3), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]),
      phoneNumber: new FormControl('', [Validators.required]),
      address: new FormControl('', [ Validators.required,Validators.minLength(5),Validators.maxLength(200) ]),
      role: new FormControl('', [Validators.required])
    });
  
  }


  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id')!;

   // this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        this.updateUserForm.patchValue({
          userName: this.user.userName,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber,
          userPassword: this.user.userPassword,
          address: this.user.address,
          role: this.user.role
        });
      },
      error: (error) => {
       // console.error('Error updating user:', error);
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          title: `Error: ${error.error?.message || 'An unknown error occurred'}`,
          showConfirmButton: false,
          timer: 2500,
        });
      },
    });
  }

  onSubmit(): void {
    this.updateUser();
  }

  updateUser(): void {
    this.updateUserForm.markAllAsTouched();
    if (this.updateUserForm.valid) {
      const updatedUser: User = this.updateUserForm.value;
      this.userService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'User updated successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.updateUserForm.reset();
          // navigate to manage :
          this.goToManage();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        },
      });
    }
  }

  goToManage() {
    this.router.navigate(['/Users/manage']);
  }

  // Getters
  get userName() { return this.updateUserForm.get('userName'); }
  get firstName() { return this.updateUserForm.get('firstName'); }
  get lastName() { return this.updateUserForm.get('lastName'); }
  get email() { return this.updateUserForm.get('email'); }
  get userPassword(){return this.updateUserForm.get('userPassword')}
  get phoneNumber() { return this.updateUserForm.get('phoneNumber'); }
  get address(){return this.updateUserForm.get(('address'))}
  get role() { return this.updateUserForm.get('role'); }
}
