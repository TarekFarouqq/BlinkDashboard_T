import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../../services/BranchServices/branch.service';
import { Ibranch } from '../../shared/Interfaces/ibranch';
import { Inventory } from '../../../../models/inventory';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SearchPipe } from '../../shared/search.pipe';

@Component({
  selector: 'app-manage-branch',
  imports: [CommonModule,FormsModule, FormsModule,SearchPipe, SpinnerComponent, RouterLink],
  templateUrl: './manage-branch.component.html',
  styleUrls: ['./manage-branch.component.scss'],
  providers: [BranchService],
})
export class ManageBranchComponent implements OnInit {
  branchList: Ibranch[] = [];
  inventoryList: Inventory[] = [];
  text:string="";
  isLoading: boolean = true;


  constructor(private _branchService: BranchService) {}

  ngOnInit() {
    this._branchService.getAllBranches().subscribe({
      next: (response) => {
        console.log(response);
        this.branchList = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }


  hasInventories(branchId: string): boolean {
    const branch = this.branchList.find(b => b.branchId == branchId);
    return branch ? branch.inventories.length > 0 : false;
  }


  deleteBranch(branchId: string): void {
    const branchHasInventories = this.hasInventories(branchId);

    if (branchHasInventories) {
    
      Swal.fire({
        title: 'This branch has inventories. Please delete inventories first.',
        icon: 'warning',
        width: 400,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    } else {
     
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
          this._branchService.deleteBranch(branchId).subscribe({
            next: (response) => {
              Swal.fire('Deleted!', response.message);
              this.refreshBranchList();
            },
            error: (error) => {
              Swal.fire('Error!', error.error.message);
            }
          });
        }
      });
    }
  }


  refreshBranchList(): void {
    this._branchService.getAllBranches().subscribe({
      next: (response) => {
        this.branchList = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
