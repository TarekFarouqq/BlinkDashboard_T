import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../../models/inventory';
import { InventoryService } from '../../../../services/inventory.service';  
import { SpinnerComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SearchPipe } from '../../shared/search.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-manage',
  imports: [SpinnerComponent,CommonModule, RouterLink ,SearchPipe,FormsModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit {
invetoryArr!: Inventory[];
isLoading: boolean = true;
text:string="";
isInventoryHasProducts! : boolean;

  constructor(private inventoryService: InventoryService, private router: Router) {}
  
  ngOnInit(){
    this.getAllInventories();
    
  }


  getAllInventories() {
    this.inventoryService.getAll().subscribe({
      next: (res) => {
        this.invetoryArr = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  navigateToUpdate(inventoryId: number) {
    this.router.navigate(['/inventory/update', inventoryId]);
  }

  deleteInventory(inventoryId: number) {
    this.inventoryService.isInventoryHasProducts(inventoryId).subscribe({
      next: (response) => {
        if (response) {
          Swal.fire({
            title: 'This inventory has products.',
            text: 'You cannot delete this inventory.',
            icon: 'warning',
            width: 400,
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          });
          return;
        }
  
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
            this.inventoryService.delete(inventoryId).subscribe({
              next: (res) => {
                this.getAllInventories();
                Swal.fire({
                  title: 'Deleted!',
                  text: 'Inventory has been deleted.',
                  icon: 'success',
                  width: 400
                });
              },
              error: (err) => {
                console.error(err);
                Swal.fire({
                  title: 'Error!',
                  text: 'Failed to delete inventory',
                  icon: 'error',
                  width: 400
                });
              }
            });
          }
        });
      },
      error: (error) => {
        console.error("Error checking inventory:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to check inventory status',
          icon: 'error',
          width: 400
        });
      }
    });
  }

}
