import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '../../../../services/branch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-branch',
  imports: [[CommonModule, ReactiveFormsModule]],
  templateUrl: './delete-branch.component.html',
  styleUrl: './delete-branch.component.scss'
})
export class DeleteBranchComponent implements OnInit {
  branchId: string = '';
  msgerror: string = '';
  hasInventories :boolean = false;

  deleteBranchForm = new FormGroup({
    branchName: new FormControl({ value: '', disabled: true }),
    branchAddress: new FormControl({ value: '', disabled: true }),
    phone: new FormControl({ value: '', disabled: true })
  });

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _BranchService: BranchService
  ) {}

 
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        // console.log(params.get('id'));
        this.branchId = params.get('id')!;
        //  console.log(this.branchId);
        this.getBranchData(this.branchId);



      }

    });

}


getBranchData(branchId: string): void {
  this._BranchService.getBranchById(branchId).subscribe({
    next: (response) => {
       console.log(response.inventories.length);
       if(response.inventories.length > 0) {
        this.msgerror = response.message;
        this.hasInventories = true;
       }
      this.deleteBranchForm.patchValue({
        branchName: response.branchName,
        branchAddress: response.branchAddress,
        phone: response.phone
      });
    },
    error: (err) => {
      this.msgerror = err.error.message;
    }
  });
}
// this._Router.navigate(['/branch/manage']);
deleteBranch(): void {
  this._BranchService.deleteBranch(this.branchId).subscribe({
    next:(response)=>{
      console.log(response);
      this.msgerror = response.message;
      this._Router.navigate(['/branch/manage']);
    },
    error:(err)=>{
      this.msgerror = err.error.message;
    }
  });
}

cancel(): void {
  this._Router.navigate(['/branch/manage']);
}

}
