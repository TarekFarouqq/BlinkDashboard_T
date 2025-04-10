import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../services/branch.service';
import { Ibranch } from '../../shared/Interfaces/ibranch';
import { Inventory } from '../../../../models/inventory';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-branch',
  imports: [CommonModule,FormsModule, SpinnerComponent,RouterLink],
  templateUrl: './manage-branch.component.html',
  styleUrl: './manage-branch.component.scss',
  providers: [BranchService],
})
export class ManageBranchComponent implements OnInit {
  branchList: Ibranch[] = [];
  inventoryList: Inventory[] = [];

  constructor(private _branchService: BranchService) {}
  // isLoading: boolean = true;


  ngOnInit() {
    // this.isLoading = true;
    this._branchService.getAllBranches().subscribe({
      next:(response)=>{
        console.log(response);

        this.branchList =response;
        // this.isLoading = false;
        

      },
      error:(error)=>{
        console.log(error);
      }
    });
  }

  // getAllBranches() {
  //   this._branchService.getAllBranches().subscribe(
  //     (response) => {
  //       this.branchList = response;
  //     },
  //     (error) => {
  //       console.error('Error fetching branches', error);
  //     }
  //   );    
  }


