import { Component } from '@angular/core';
import { BranchService } from '../../../../../services/BranchServices/branch.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-branch',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent  {
  // addBranchForm: FormGroup;
  msgerror: string = '';
constructor(private _BranchService:BranchService,private _Router:Router){}
  


addBranchForm = new FormGroup({
  branchName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  branchAddress: new FormControl('', [Validators.required, Validators.minLength(3)]),
  phone: new FormControl('', [Validators.required,Validators.pattern('^[0-9]{11}$')]),
});

addNewBranch():void{
  if(this.addBranchForm.valid){
    this._BranchService.addBranch(this.addBranchForm.value).subscribe({
      next:(response)=>{
      //  console.log(response);
       this.msgerror = response.message;
        this._Router.navigate(['/branch/manage']);
      },
      error:(err)=>{
        // console.log(err);
        this.msgerror = err.error.message;
      }
    });

  }

}

}
