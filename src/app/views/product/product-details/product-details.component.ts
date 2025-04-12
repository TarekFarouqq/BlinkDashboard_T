import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { SpinnerComponent } from '@coreui/angular';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product-details',
  imports: [
    SpinnerComponent,
    ReactiveFormsModule,
    FormsModule,
    ButtonDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  isLoading: boolean = true;
  ProductId!: number;
  ProductEntity!: Product;
  ProductForm!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private productServ: ProductService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.ProductId = Number(params.get('id'));
    });
  }
  ngOnInit() {
    this.ProductForm = this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      supplierId: ['', Validators.required],
      brandId: [0, Validators.required],
      categoryId: [0, Validators.required],
      productImages: this.fb.array([]),
    });
    if (this.ProductId > 0) {
      this.productServ.GetById(this.ProductId).subscribe(
        (res) => {
          this.ProductEntity = res;
          this.isLoading = false;
          this.ProductForm.patchValue({
            productName: this.ProductEntity.productName,
            productDescription: this.ProductEntity.productDescription,
            brandId: this.ProductEntity.brandId,
            categoryId: this.ProductEntity.categoryId,
          });
          if (
            this.ProductEntity.productImages &&
            this.ProductEntity.productImages.length > 0
          ) {
            this.ProductEntity.productImages.forEach((imagePath) => {
              this.addExistingImage(imagePath);
            });
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
    }
  }

  get productImages(): FormArray {
    return this.ProductForm.get('productImages') as FormArray;
  }
  addImage() {
    const imgGroup = this.fb.group({
      productId: [this.ProductId],
      productImage: [null, Validators.required],
    });
    this.productImages.push(imgGroup);
  }
  addExistingImage(imagePath: string) {
    const imgGroup = this.fb.group({
      productImage: [imagePath, Validators.required],
      previewUrl: [imagePath],
    });
    this.productImages.push(imgGroup);
  }
  removeImage(index: number): void {
    this.productImages.removeAt(index);
  }
  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      this.productImages.at(index).patchValue({
        productImage: file,
        previewUrl: previewUrl,
      });
    }
  }
  submitForm() {
    this.isLoading = true;
    const formData = new FormData();
    const formValue = this.ProductForm.value;
    formData.append('productName', formValue.productName);
    formData.append('productDescription', formValue.productDescription);
    formData.append('supplierId', '7ee33e65-2ba8-4d35-bb42-f097c1bbe922');
    formData.append('brandId', formValue.brandId);
    formData.append('categoryId', formValue.categoryId);
    let hasOldImages = false;
    let hasNewImages = false;
    formValue.productImages.forEach((img: any) => {
      const file = img.productImage;
      if (this.ProductEntity) {
        //update
        if (file instanceof File) {
          formData.append('NewProductImages', file);
          hasNewImages = true;
        } else {
          formData.append('OldProductImages', file);
          hasOldImages = true;
        }
      } else {
        //insert
        if (file instanceof File) {
          formData.append('productImages', file);
          hasNewImages = true;
        }
      }
    });
    if (this.ProductEntity) {
      if (!hasOldImages) {
        formData.append('OldProductImages', '');
      }
      if (!hasNewImages) {
        formData.append('NewProductImages', new Blob());
      }
    }
    if (!this.ProductEntity) {
      // admin => insert product
      // supplier => 
      this.productServ.InsertProduct(formData).subscribe(
        (res) => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Product added successfully, Please Wait to be reviewed',
            showConfirmButton: false,
            timer: 2500,
          });
          this.router.navigate(['/product/manage']);
        },
        (err) => {
          this.isLoading = false;
          const errors = err.error?.errors;
          let errorMessage = 'An unexpected error occurred.';
          if (errors && typeof errors === 'object') {
            const firstKey = Object.keys(errors)[0];
            if (firstKey && errors[firstKey].length > 0) {
              errorMessage = errors[firstKey][0];
            }
          }

          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'error',
            title: errorMessage,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      );
    } else {
      this.productServ.UpdateProduct(this.ProductId, formData).subscribe(
        (res) => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Product Updated successfully, Please Wait to be reviewed',
            showConfirmButton: false,
            timer: 2500,
          });
          this.router.navigate(['/product/manage']);
        },
        (err) => {
          this.isLoading = false;
          const errors = err.error?.errors;
          let errorMessage = 'An unexpected error occurred.';
          if (errors && typeof errors === 'object') {
            const firstKey = Object.keys(errors)[0];
            if (firstKey && errors[firstKey].length > 0) {
              errorMessage = errors[firstKey][0];
            }
          }
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'error',
            title: errorMessage,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      );
    }
  }

  getImageSrc(image: any): string | null {
    if (image && image.previewUrl) {
      return image.previewUrl;
    }
    if (!image) return null;
    if (typeof image === 'string') {
      return image;
    }
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return null;
  }
}
