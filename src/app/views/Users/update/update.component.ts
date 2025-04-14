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
  userId!: number;
  user!: AddUser;
  
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.updateUserForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      userFirstName: new FormControl('', [Validators.required]),
      userLastName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userPhone: new FormControl('', [Validators.required]),
      userRole: new FormControl('', [Validators.required])
    });
  }


  ngOnInit(): void {
    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.userService.getUserById(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        this.updateUserForm.patchValue({
          userName: this.user.userName,
          userFirstName: this.user.firstName,
          userLastName: this.user.lastName,
          userEmail: this.user.email,
          userPhone: this.user.phoneNumber,
          userPassword: this.user.userPassword,
          address: this.user.address,
          userRole: this.user.role
        });
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  onSubmit(): void {
    this.updateUser();
  }

  updateUser(): void {
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
  get userFirstName() { return this.updateUserForm.get('userFirstName'); }
  get userLastName() { return this.updateUserForm.get('userLastName'); }
  get userEmail() { return this.updateUserForm.get('userEmail'); }
  get userPhone() { return this.updateUserForm.get('userPhone'); }
  get userRole() { return this.updateUserForm.get('userRole'); }
}
