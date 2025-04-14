import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';
import { ProductService } from '../../../../services/product.service';
import { ReviewSuppliedProducts } from '../../../../models/review-supplied-products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-products',
  imports: [SpinnerComponent, CommonModule,FormsModule],
  templateUrl: './review-products.component.html',
  styleUrl: './review-products.component.scss'
})
export class ReviewProductsComponent implements OnInit {
  isLoading:boolean=false;
  ReviewSuppliersProducts:ReviewSuppliedProducts[]=[];
  CurrentSelectedStatus:any=null;
  constructor(private productServ:ProductService,private router:Router){}
  ngOnInit() {
    this.productServ.GetReviewSuppliedProducts().subscribe((res)=>{
      this.ReviewSuppliersProducts=res;
    })
  }
  get FilteredReviewSuppliedProducts(){
    return this.ReviewSuppliersProducts.filter((prd)=>{
      return prd.requestStatus==this.CurrentSelectedStatus;
    })
  }
  selectPrd(prd:ReviewSuppliedProducts){
    this.router.navigate(['/product/review-products-details',prd.requestId]);
  }
}
