import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-attributes',
  imports: [SpinnerComponent,CommonModule,FormsModule],
  templateUrl: './product-attributes.component.html',
  styleUrl: './product-attributes.component.scss',
})
export class ProductAttributesComponent implements OnInit {
  isLoading: boolean = true;
  ProductArr!: Product[];
  CurrentPage: number = 1;
  TotalPages!: number;
  FilterProduct:string='';
  constructor(private productServ: ProductService,private router:Router) {}
  ngOnInit() {
    this.productServ.GetTotalPages(8).subscribe((res) => {
      this.TotalPages = res;
      this.CurrentPage = this.TotalPages;
      this.productServ
        .GetPagginatedProducts(this.CurrentPage, 8)
        .subscribe((res) => {
          this.ProductArr = res;
          this.isLoading = false;
        });
    });
  }
  nextPage() {
    this.isLoading = true;
    this.CurrentPage++;
    if (this.CurrentPage > this.TotalPages) {
      this.CurrentPage = this.TotalPages;
    }

    this.productServ
      .GetPagginatedProducts(this.CurrentPage, 8)
      .subscribe((res) => {
        this.ProductArr = res;
      });
    this.isLoading = false;
  }
  prevPage() {
    this.isLoading = true;
    this.CurrentPage--;
    if (this.CurrentPage < 1) {
      this.CurrentPage = 1;
    }

    this.productServ
      .GetPagginatedProducts(this.CurrentPage, 8)
      .subscribe((res) => {
        this.ProductArr = res;
      });
    this.isLoading = false;
  }
  filterProductArr(){
    if(!this.FilterProduct){
      this.CurrentPage=this.TotalPages
      this.productServ.GetPagginatedProducts(this.CurrentPage, 8).subscribe((res) => {
        this.ProductArr=res;
      })
    }else{
    this.CurrentPage=1;
    this.productServ.GetFilteredProducts(this.FilterProduct,this.CurrentPage,8).subscribe((res) => {
        this.ProductArr=res;
      })
    }
  }
  navigateToProductDetails(prdId:number){
    this.router.navigate(['product/product-attributes-details/', prdId]);
  }
}
