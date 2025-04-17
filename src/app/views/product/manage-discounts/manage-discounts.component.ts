import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';
import { DiscountService } from '../../../../services/discount.service';
import { ReadDiscountDetailsDTO } from '../../../../models/read-discount-details-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-manage-discounts',
  imports: [SpinnerComponent,CommonModule,FormsModule],
  templateUrl: './manage-discounts.component.html',
  styleUrl: './manage-discounts.component.scss'
})
export class ManageDiscountsComponent implements OnInit {
  isLoading:boolean=false;
  DiscountArr!:ReadDiscountDetailsDTO[];
  constructor(private discountServ:DiscountService,private router:Router){}
  ngOnInit() {
    this.discountServ.GetDiscounts().subscribe((res)=>{
      this.DiscountArr=res;
    })
  }
  NavigateToDetails(id:number){
    this.router.navigate([`/product/discount-details/${id}`]);
  }
}
