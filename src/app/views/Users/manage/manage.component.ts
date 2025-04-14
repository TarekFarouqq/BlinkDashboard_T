import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';
import { User } from '../../../../models/User';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-manage',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit{

  users: User[] = [];
  search: string = '';
  isLoading: boolean = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }


searchUser() {
    if (this.search.trim()) {
      this.userService.getUserByName(this.search).subscribe({
        next: (res) => {
          this.users = res;
          if (this.users.length === 0) {
            this.loadUsers();
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No user found!',
            width: 400,
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      this.loadUsers();
    }
  }

  onSearchInputChange() {
    if (!this.search.trim()) {
      this.loadUsers();
    }
  }

  goToUserDisplay(id: string): void {
    console.log('Selected user id:', id);
    this.router.navigate(['/Users/display', id]);
  }

  navigateToUpdate(userId: string) {
    this.router.navigate(['/Users/update', userId]);
    console.log(userId);
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      width: 400,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(Number(userId)).subscribe({
          next: (res) => {
            this.loadUsers();
            console.log('User deleted successfully!');
          },
          error: (err) => {
            console.error('Error deleting user:', err);
          },
        });
      }
    });
  }
}