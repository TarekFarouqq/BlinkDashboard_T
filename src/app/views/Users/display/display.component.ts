import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/User';
 

@Component({
  selector: 'app-display',
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss'
})
export class DisplayComponent  implements OnInit{
  userId: string = '';
  user: User | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = id;
      this.loadUserDetails();
    } else {
      console.error('User ID is missing from the route');
    }
  }



  loadUserDetails(): void {
    this.userService.getUserById(Number(this.userId)).subscribe({
      next: (data) => {
        console.log('Received user data:', data);
        this.user = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }
  navigateToUpdate(id: number): void {
    this.router.navigate(['/Users/update', id]);
  }
  goBackToList(): void {
    this.router.navigate(['/Users/manage']);
  }
  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.goBackToList();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  
}
}