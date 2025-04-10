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
        console.log('Inventory deleted successfully');
      },
      error: (err) => {
        console.error(err);
      }
    });
      }
    });

  }

}
