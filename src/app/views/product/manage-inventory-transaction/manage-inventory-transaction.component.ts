import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '@coreui/angular';
import { TransactionHistoryService } from '../../../../services/transaction-history.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-inventory-transaction',
  imports: [SpinnerComponent,FormsModule,CommonModule],
  templateUrl: './manage-inventory-transaction.component.html',
  styleUrl: './manage-inventory-transaction.component.scss'
})
export class ManageInventoryTransactionComponent implements OnInit {
  isLoading:boolean=false;
  currentPage:number=1;
  TransactionArr!:any[];
  constructor(private transactionServ:TransactionHistoryService,private router:Router){}
  ngOnInit() {
    this.transactionServ.GetTransactionHistory().subscribe((res)=>{
      this.TransactionArr=res;
    })
  }
  NavigateToDetails(id:number){
    this.router.navigate(['/product/transaction-details/', id]);
  }
}
