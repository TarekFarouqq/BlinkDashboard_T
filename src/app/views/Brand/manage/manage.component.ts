import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../../models/brand';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BrandService } from '../../../../services/brand.service';
import { Product } from '../../../../models/product';
@Component({
  selector: 'app-manage',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
})
export class ManageComponent implements OnInit {
  brand: any;
  brands: Brand[] = [];
  //productList: Product[]=[];
  search: string = '';
  isLoading: boolean = true;
  constructor(private brandService: BrandService, private router: Router) {}
  ngOnInit(): void {
    this.loadBrands();
  }
  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.brands = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
      },
    });
  }
  searchBrand() {
    if (this.search.trim()) {
      this.brandService.getBrandByName(this.search).subscribe({
        next: (res) => {
          this.brands = res;
          if (this.brands.length > 0) {
          } else {
            this.loadBrands();
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No brand found!',
            width: 400,
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      // empty search input :
      this.loadBrands();
    }
  }
  onSearchInputChange() {
    if (!this.search.trim()) {
      this.loadBrands();
    }
  }
  goToBrandDisplay(brandId: number): void {
    this.router.navigate(['/Brand/display', brandId]);
  }
  navigateToUpdate(brandid: number) {
    this.router.navigate(['/Brand/update/', brandid]);
    console.log(brandid);
  }

 

  deleteBrand(brandId: number): void {
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
        this.brandService.deleteBrand(brandId).subscribe({
          next: (res) => {
          //  this.loadBrands();
          this.brands = this.brands.filter(b => b.brandId !== brandId);
            console.log('Brand deleted successfully!');
            Swal.fire({
              title: 'Deleted!',
              text: 'Brand deleted successfully.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
            });
          },
          error: (err) => {
            if (err.status === 409) {
              Swal.fire({
                title: 'Can\'t Delete!',
                text: 'This brand has active products. Delete products first!',
                icon: 'warning',
                confirmButtonColor: '#d33',
              });
          }else{
            Swal.fire({
              title: 'Error!',
              text: 'An error occurred while deleting the brand.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
          }
        },
      });
    }
  });
}
}