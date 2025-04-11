  import { Component, OnInit } from '@angular/core';
  import { ProductService } from '../../../../services/product.service';
  import { Product } from '../../../../models/product';
  import { CommonModule } from '@angular/common';
  import { SpinnerComponent } from '@coreui/angular';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  declare var bootstrap: any;
  @Component({
    selector: 'app-manage',
    imports: [CommonModule,FormsModule, SpinnerComponent],
    templateUrl: './manage.component.html',
    styleUrl: './manage.component.scss',
  })
  export class ManageComponent implements OnInit {
    ProductArr!: Product[];
    isLoading: boolean = true;
    CurrentPage: number = 1;
    TotalPages!: number;
    selectedProductId!: number;
    FilterProduct:string='';
    constructor(private productServ: ProductService, private router: Router) {}
    ngOnInit() {
      this.productServ.GetTotalPages(8).subscribe((res) => {
        this.TotalPages = res;
        this.CurrentPage=this.TotalPages;
        this.productServ.GetPagginatedProducts(this.CurrentPage, 8).subscribe(
          (res) => {
            this.ProductArr = res;
            this.isLoading = false;
          },
          (err) => {
            console.log(err);
            this.isLoading = false;
          }
        );
      });
    }
    nextPage() {
      this.CurrentPage++;
      if (this.CurrentPage > this.TotalPages) {
        this.CurrentPage = this.TotalPages;
      }

      this.productServ
        .GetPagginatedProducts(this.CurrentPage, 8)
        .subscribe((res) => {
          this.ProductArr = res;
        });
    }
    prevPage() {
      this.CurrentPage--;
      if (this.CurrentPage < 1) {
        this.CurrentPage = 1;
      }

      this.productServ
        .GetPagginatedProducts(this.CurrentPage, 8)
        .subscribe((res) => {
          this.ProductArr = res;
        });
    }
    openDeleteModal(productId: number) {
      this.selectedProductId = productId;
      const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
      modal.show();
    }
    confirmDelete() {
      const modalElement = document.getElementById('deleteModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      this.isLoading = true;
      this.productServ.DeleteProduct(this.selectedProductId).subscribe((res) => {
        // console.log(res);
        this.productServ
          .GetPagginatedProducts(this.CurrentPage, 8)
          .subscribe((res) => {
            this.ProductArr = res;
            this.isLoading = false;
          });
      });
    }
    filterProductArr(){
      this.CurrentPage=1;
      if(!this.FilterProduct){
        this.productServ.GetPagginatedProducts(this.CurrentPage, 8).subscribe((res) => {
          this.ProductArr=res;
        })
      }else{
        this.productServ.GetFilteredProducts(this.FilterProduct,this.CurrentPage,8).subscribe((res) => {
          this.ProductArr=res;
        })
      }
    }
    navigateToProductDetails(prdId:number){
      this.router.navigate(['product/product-details/', prdId]);
    }
  }
