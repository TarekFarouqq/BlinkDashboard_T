import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-attributes',
  imports: [SpinnerComponent, CommonModule, FormsModule],
  templateUrl: './product-attributes.component.html',
  styleUrl: './product-attributes.component.scss',
})
export class ProductAttributesComponent implements OnInit {
  isLoading: boolean = true;
  ProductArr!: Product[];
  CurrentPage: number = 1;
  TotalPages!: number;
  FilterProduct: string = '';
  UserId!: string;
  UserRole!: string;
  constructor(
    private productServ: ProductService,
    private router: Router,
    private authServ: AuthService
  ) {}
  ngOnInit() {
    // this.productServ.GetTotalPages(8).subscribe((res) => {
    //   this.TotalPages = res;
    //   this.CurrentPage = this.TotalPages;
    //   this.productServ
    //     .GetPagginatedProducts(this.CurrentPage, 8)
    //     .subscribe((res) => {
    //       this.ProductArr = res;
    //       this.isLoading = false;
    //     });
    // });
    this.isLoading = true;
    this.UserId = this.authServ.getUserId() ?? '';
    this.UserRole = this.authServ.getUserRoleFromToken() ?? '';
    if (this.UserRole == 'Supplier') {
      this.productServ.GetTotalPagesWithUser(8, this.UserId).subscribe({
        next: (res) => {
          this.TotalPages = res;
          this.CurrentPage = this.TotalPages;
          this.productServ
            .GetPagginatedProductsWithUser(this.CurrentPage, 8, this.UserId)
            .subscribe({
              next: (response) => {
                this.ProductArr = response;
                this.isLoading = false;
              },
              error: () => {
                this.ShowErrorPanel(
                  'There is an error happened whily trying to get data from server'
                );
              },
            });
        },
        error: () => {
          this.ShowErrorPanel(
            'There is an error occured whily trying to get data from server'
          );
        },
      });
    } else if (this.UserRole == 'Admin') {
      this.productServ.GetTotalPages(8).subscribe({
        next: (res) => {
          this.TotalPages = res;
          this.CurrentPage = this.TotalPages;
          this.productServ
            .GetPagginatedProducts(this.CurrentPage, 8)
            .subscribe({
              next: (response) => {
                this.ProductArr = response;
                this.isLoading = false;
              },
              error: () => {
                this.ShowErrorPanel(
                  'There is an error occured whily trying to get data from server'
                );
              },
            });
        },
        error: () => {
          this.ShowErrorPanel(
            'There is an error occured whily trying to get data from server'
          );
        },
      });
    }
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

  getDataDependOnUser(page: number) {
    if (this.UserRole == 'Supplier') {
      this.productServ.GetTotalPagesWithUser(8, this.UserId).subscribe({
        next: (res) => {
          this.TotalPages = res;
          this.productServ
            .GetPagginatedProductsWithUser(page, 8, this.UserId)
            .subscribe({
              next: (response) => {
                this.ProductArr = response;
                this.isLoading = false;
              },
              error: () => {
                this.ShowErrorPanel(
                  'There is an error occured whily trying to get data from server'
                );
              },
            });
        },
        error: () => {
          this.ShowErrorPanel(
            'There is an error occured whily trying to get data from server'
          );
        },
      });
    }else{
      this.productServ.GetTotalPages(8).subscribe({
        next:(res)=>{
          this.TotalPages=res;
          this.productServ.GetPagginatedProducts(page,8).subscribe({
            next:(res)=>{
              this.ProductArr=res;
              this.isLoading=false
            },
            error:()=>{
              this.ShowErrorPanel(
                'There is an error occured whily trying to get data from server'
              );
            }
          })
        },
        error:()=>{
          this.ShowErrorPanel(
            'There is an error occured whily trying to get data from server'
          );
        }
      })
    }
  }

  nextPage() {
    this.isLoading = true;
    this.CurrentPage++;
    if (this.CurrentPage > this.TotalPages) this.CurrentPage = this.TotalPages;
    this.getDataDependOnUser(this.CurrentPage);
  }
  prevPage() {
    this.isLoading = true;
    this.CurrentPage--;
    if (this.CurrentPage < 1) this.CurrentPage = 1;
    this.getDataDependOnUser(this.CurrentPage);
  }
  filterProductArr() {
    
  }
  navigateToProductDetails(prdId: number) {
    this.router.navigate(['product/product-attributes-details/', prdId]);
  }
}
