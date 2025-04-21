import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-manage',
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
})
export class ManageComponent implements OnInit {
  ProductArr!: Product[];
  isLoading: boolean = true;
  CurrentPage: number = 1;
  TotalPages: number = 1;
  selectedProductId!: number;
  FilterProduct: string = '';
  UserRole!: string | '';
  CurrentUserId!: string | '';
  constructor(
    private productServ: ProductService,
    private router: Router,
    private authServ: AuthService
  ) {
    this.UserRole = this.authServ.getUserRoleFromToken() ?? '';
    this.CurrentUserId = this.authServ.getUserId() ?? '';
    if(this.UserRole=="Supplier"){
      this.productServ.GetTotalPagesWithUser(8,this.CurrentUserId).subscribe({
        next:(res)=>{
          this.TotalPages=res;
          this.CurrentPage=this.TotalPages
          this.productServ.GetPagginatedProductsWithUser(this.CurrentPage,8,this.CurrentUserId).subscribe({
            next:(dRes)=>{
              this.ProductArr=dRes;
              this.isLoading=false
            },
            error:()=>{
              // this.ShowErrorPanel("Error while trying to get data from database");
            }
          })
        },
        error:()=>{
          // this.ShowErrorPanel("Error while trying to get data from database");
        }
      })
    }else{
      this.productServ.GetTotalPages(8).subscribe({
        next:(response)=>{
          this.TotalPages=response;
          this.CurrentPage=this.TotalPages;
          this.productServ.GetPagginatedProducts(this.CurrentPage,8).subscribe({
            next:(res)=>{
              this.ProductArr=res;
              this.isLoading=false;
            },
            error:()=>{
              this.ShowErrorPanel("Error while trying to get data from database");
            }
          })
        },
        error:()=>{
          this.ShowErrorPanel("Error while trying to get data from database");
        }
      })
    }



    // First get total pages
    // this.productServ.GetTotalPages(8).subscribe({
    //   next: (res) => {
    //     this.TotalPages = res;
    //     // Then get products for the last page
    //     // Get Products For Supplier
        
    //     // Get All Products For Supplier
    //     this.productServ.GetPagginatedProducts(this.TotalPages, 8).subscribe({
    //       next: (products) => {
    //         this.ProductArr = products;
    //         this.CurrentPage=this.TotalPages
    //         this.isLoading = false;
    //       },
    //       error: (err) => console.error(err)
    //     });
    //   },
    //   error: (err) => console.error(err)
    // });
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
    this.isLoading=false
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
    this.isLoading=false
  }


  ngOnInit() {

  }
  nextPage() {
    this.isLoading=true
    this.CurrentPage=this.CurrentPage+1;
    this.productServ.GetPagginatedProducts(this.CurrentPage,8).subscribe({
      next:(res)=>{
        this.ProductArr=res;
    this.isLoading=false
  }
    })
  }
  prevPage() {
    this.isLoading=true
    this.CurrentPage = this.CurrentPage-1;
    this.productServ.GetPagginatedProducts(this.CurrentPage,8).subscribe({
      next:(res)=>{
        this.ProductArr=res;
        this.isLoading=false
      }
    })
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
      this.productServ
        .GetPagginatedProducts(this.CurrentPage, 8)
        .subscribe((res) => {
          this.ProductArr = res;
          this.isLoading = false;
        });
    });
  }
  filterProductArr() {
    this.CurrentPage = 1;
    if (!this.FilterProduct) {
      this.productServ
        .GetPagginatedProducts(this.CurrentPage, 8)
        .subscribe((res) => {
          this.ProductArr = res;
        });
    } else {
      this.productServ
        .GetFilteredProducts(this.FilterProduct, this.CurrentPage, 8)
        .subscribe((res) => {
          this.ProductArr = res;
        });
    }
  }
  navigateToProductDetails(prdId: number) {
    this.router.navigate(['product/product-details/', prdId]);
  }
}
