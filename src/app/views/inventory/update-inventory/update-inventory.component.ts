import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { InventoryService } from '../../../../services/inventory.service';  
import Swal from 'sweetalert2';
import { Inventory } from '../../../../models/inventory';
import { ActivatedRoute, Router } from '@angular/router';
import { Ibranch } from '../../shared/Interfaces/ibranch';
import { BranchService } from '../../../../services/BranchServices/branch.service';


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
  BranchArr!:Ibranch[];
  constructor(private inventoryService: InventoryService,private branchServ:BranchService , private ActivatedRoute: ActivatedRoute,private router:Router) {
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
    this.branchServ.getAllBranches().subscribe({
      next:(branches)=>{
        this.BranchArr=branches;
        //   next: (response) => {
        //     this.inventory = response;
        //     this.updateInventoryForm.patchValue(this.inventory);
        //   },
        //   error: (error) => {
        //     console.error('Error fetching inventory:', error);
        //   }
        // });
      }
    })
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
          this.router.navigate(['/inventory'])
        },
        error: (error) => {
          console.error('Error adding inventory:', error);
        }
      });}
    }

    // Get Latitude And Longitude
    getLatLongFromLink(givinLink:string){
      const regex = /@?(-?\d+\.\d+),(-?\d+\.\d+)/;
      
      const match = givinLink.match(regex);
      if(match){
        this.updateInventoryForm.patchValue({
          lat:match[1],
          long:match[2]
        })
      }
    }

   // Getter methods
   get inventoryName() { return this.updateInventoryForm.get('inventoryName'); }
   get inventoryAddress() { return this.updateInventoryForm.get('inventoryAddress'); }
   get phone() { return this.updateInventoryForm.get('phone'); }
   get branchId() { return this.updateInventoryForm.get('branchId'); }
   get lat() { return this.updateInventoryForm.get('lat'); }
   get long() { return this.updateInventoryForm.get('long'); }

}
