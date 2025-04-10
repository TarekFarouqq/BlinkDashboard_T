import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { InventoryService } from '../../../../services/inventory.service';  
import Swal from 'sweetalert2';
import { Inventory } from '../../../../models/inventory';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-update-inventory',
  imports: [ReactiveFormsModule],
  templateUrl: './update-inventory.component.html',
  styleUrl: './update-inventory.component.scss'
})
export class UpdateInventoryComponent implements OnInit {
  updateInventoryForm: FormGroup;
  inventory! : Inventory;
  inventoryId!: number ;
  //modify 
  branches: { id: number, name: string }[] = []; 

  constructor(private inventoryService: InventoryService,  private ActivatedRoute: ActivatedRoute) {

    this.updateInventoryForm = new FormGroup({
      inventoryName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      inventoryAddress: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phone: new FormControl('', [Validators.required,Validators.pattern('^[0-9]{11}$')]),
      branchId: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required]),
      long: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit() {
     this.inventoryId = Number(this.ActivatedRoute.snapshot.paramMap.get('id'));
     this.inventoryService.getById(this.inventoryId).subscribe({
       next: (response) => {
         this.inventory = response;
         this.updateInventoryForm.patchValue(this.inventory);
       },
       error: (error) => {
         console.error('Error fetching inventory:', error);
       }
     })

    // modify
    this.branches = [
      { id: 1, name: 'Cairo' },
      { id: 2, name: 'Mansoura' },
    ];
  }
  
  onSubmit() {
    this.updateInventory();
  }



  updateInventory() {
    if (this.updateInventoryForm.valid) {
      this.inventoryService.update(this.updateInventoryForm.value, this.inventoryId).subscribe({
        next: (response) => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Inventory Updated successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.updateInventoryForm.reset(); 
        },
        error: (error) => {
          console.error('Error adding inventory:', error);
        }
      });}
    
    }

   // Getter methods
   get inventoryName() { return this.updateInventoryForm.get('inventoryName'); }
   get inventoryAddress() { return this.updateInventoryForm.get('inventoryAddress'); }
   get phone() { return this.updateInventoryForm.get('phone'); }
   get branchId() { return this.updateInventoryForm.get('branchId'); }
   get lat() { return this.updateInventoryForm.get('lat'); }
   get long() { return this.updateInventoryForm.get('long'); }

}
