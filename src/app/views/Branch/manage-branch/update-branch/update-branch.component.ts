import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../../services/branch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-update-branch',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.scss']
})
export class UpdateBranchComponent implements OnInit {
  branchId: string = '';
  msgerror: string = '';

  constructor(
    private _BranchService: BranchService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {}
  updateBranchForm = new FormGroup({
    branchName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    branchAddress: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
  });


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
       console.log(response);
      this.updateBranchForm.patchValue({
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


  updateBranch(): void {
    this._BranchService.updateBranch(this.branchId, this.updateBranchForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.msgerror = response.message;
        this._Router.navigate(['/branch/manage']);
      },
      error: (err) => {
        this.msgerror = err.error.message;
      }
    });
  }
  cancel(): void {
    this._Router.navigate(['/branch/manage']);
  }
}
