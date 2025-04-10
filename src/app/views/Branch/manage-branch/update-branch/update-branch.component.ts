import { Component } from '@angular/core';
import { BranchService } from '../../../../services/branch.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-branch',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-branch.component.html',
  styleUrl: './update-branch.component.scss'
})
export class UpdateBranchComponent {
  constructor(
    private _BranchService: BranchService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  addBranchForm = new FormGroup({
    branchName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    branchAddress: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
  });

  updateBranch(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this._BranchService.updateBranch(id, this.addBranchForm.value).subscribe({
            next: (response) => {
              console.log(response);
              this._Router.navigate(['/branch/manage']);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      }
    });
  }
}
