import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '@coreui/angular';
import { TransactionHistoryService } from '../../../../services/transaction-history.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manage-inventory-transaction',
  imports: [SpinnerComponent, FormsModule, CommonModule],
  templateUrl: './manage-inventory-transaction.component.html',
  styleUrl: './manage-inventory-transaction.component.scss',
})
export class ManageInventoryTransactionComponent implements OnInit {
  isLoading: boolean = false;
  currentPage:number =1;
  TransactionArr!: any[];
  TotalPages!: number;
  constructor(
    private transactionServ: TransactionHistoryService,
    private router: Router
  ) {}
  ngOnInit() {
   this.transactionServ.GetTotalPages(10).subscribe({
    next:(res)=>{
      this.TotalPages=res;
      // this.currentPage=this.TotalPages;
      this.transactionServ.GetDataWithPagination(this.currentPage,10).subscribe({
        next:(response)=>{
          this.TransactionArr=response;
        }
      })
    }
   })
  }
  NavigateToDetails(id: number) {
    this.router.navigate(['/product/transaction-details/', id]);
  }
  ShowErrorPanel(msg: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      theme: 'light',
      icon: 'error',
      title: msg,
      showConfirmButton: false,
      timer: 2500,
    });
    this.isLoading = false;
  }
  ShowSuccessPanel(msg: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      theme: 'light',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 2500,
    });
    this.isLoading = false;
  }
  nextPage(){
    this.currentPage++;
    this.transactionServ.GetDataWithPagination(this.currentPage,10).subscribe({
      next:(response)=>{
        this.TransactionArr=response;
      }
    })
  }
  prevPage(){
    this.currentPage--;
    this.transactionServ.GetDataWithPagination(this.currentPage,10).subscribe({
      next:(response)=>{
        this.TransactionArr=response;
      }
    })
  }
}
