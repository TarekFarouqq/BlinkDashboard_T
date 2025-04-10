import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../../models/inventory';
import { InventoryService } from '../../../../services/inventory.service';  
import { SpinnerComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;


@Component({
  selector: 'app-manage',
  imports: [SpinnerComponent,CommonModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit {
invetoryArr!: Inventory[];
  isLoading: boolean = true;

  constructor(private inventoryService: InventoryService) {}
  
  ngOnInit(){
    this.getAllInventories();
  }


  getAllInventories() {
    this.inventoryService.getAll().subscribe({
      next: (res) => {
        this.invetoryArr = res;
        console.log(this.invetoryArr);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
