import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FormControlDirective,
  FormDirective,
  SpinnerComponent,
} from '@coreui/angular';
import { Brand } from '../../../../models/brand';
import { BrandService } from '../../../../services/brand.service';
import { ProductService } from '../../../../services/product.service';
import { InventoryService } from '../../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../../../../models/inventory';
import { Product } from '../../../../models/product';
import { forkJoin, of } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product-details',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormDirective,
    FormControlDirective,
    CommonModule,
    FormsModule,
    SpinnerComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  BrandArr!: Brand[];
  CategoryArr!: any[];
  InventoryArr!: Inventory[];
  ProductEntity!: Product;
  ProductForm!: FormGroup;
  ProductId!: number;
  isLoading: boolean = true;
  CurrentUserLatitude!: number;
  CurrentUserLongitude!: number;
  closestInventoryId!: number;
  SupplierId!: string | '';
  UserRole!: string | '';
  constructor(
    private brandServ: BrandService,
    private inventoryServ: InventoryService,
    private productServ: ProductService,
    private fb: FormBuilder,
    private routes: ActivatedRoute,
    private authServ: AuthService,
    private router: Router
  ) {
    this.SupplierId = this.authServ?.getUserId() ?? '';
    this.UserRole = this.authServ.getUserRoleFromToken() ?? '';
    this.ProductForm = this.fb.group({
      productName: ['', Validators.required],
      productDescription: ['', Validators.required],
      supplierId: [this.SupplierId, Validators.required],
      brandId: [null, Validators.required],
      categoryId: [null, Validators.required],
      productImages: this.fb.array([]),
      ProductStocks: this.fb.array([]),
    });
    this.routes.paramMap.subscribe((params) => {
      this.ProductId = Number(params.get('id'));
      if (this.ProductId > 0) {
        this.productServ.GetProductStock(this.ProductId).subscribe((res) => {
          res.forEach((stock: any) => {
            this.AddExistingProductStock(
              stock.inventoryId,
              stock.stockQuantity,
              stock.stockUnitPrice
            );
          });
        });
      }
    });
  }
  ngOnInit() {
    this.isLoading = true;
    this.getUserLocation();
    const brandObs = this.brandServ.getAllBrands();
    const categoryObs = this.productServ.GetChildCategory();
    const inventoryObs = this.inventoryServ.getAll();
    const productObs =
      this.ProductId > 0 ? this.productServ.GetById(this.ProductId) : of(null);
    forkJoin({
      brands: brandObs,
      categories: categoryObs,
      inventory: inventoryObs,
      product: productObs,
    }).subscribe(({ brands, categories, inventory, product }) => {
      this.BrandArr = brands;
      this.CategoryArr = categories;
      this.InventoryArr = inventory;
      this.findClosestInventory();
      if (product) {
        this.ProductEntity = product;
        this.ProductForm.patchValue({
          productName: product.productName,
          productDescription: product.productDescription,
          brandId: product.brandId,
          categoryId: product.categoryId,
        });
        this.ProductEntity.productImages.forEach((image) => {
          this.AddExistingImage(image);
        });
      }
    });
    this.isLoading = false;
  }
  get ProductImages(): FormArray {
    return this.ProductForm.get('productImages') as FormArray;
  }
  get ProductStocks(): FormArray {
    return this.ProductForm.get('ProductStocks') as FormArray;
  }
  AddProductImage() {
    this.ProductImages.push(
      this.fb.group({
        productId: [this.ProductId],
        productImage: [null, Validators.required],
        previewUrl: [null],
      })
    );
  }
  AddExistingImage(imagePath: string) {
    this.ProductImages.push(
      this.fb.group({
        productId: [this.ProductId],
        productImage: [imagePath, Validators.required],
        previewUrl: [imagePath],
      })
    );
  }
  OnImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.ProductImages.at(index).patchValue({
          productId: this.ProductId,
          productImage: file,
          previewUrl: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }
  AddProductStock() {
    const stockGroup = this.fb.group({
      inventoryId: [
        {
          value: this.closestInventoryId,
          disabled: this.UserRole === 'Supplier',
        },
        Validators.required,
      ],
      productId: [this.ProductId, Validators.required],
      stockUnitPrice: [null, Validators.required],
      stockQuantity: [null, Validators.required],
    });
    this.ProductStocks.push(stockGroup);
  }
  AddExistingProductStock(invId: number, qnt: number, pri: number) {
    this.ProductStocks.push(
      this.fb.group({
        inventoryId: [invId, Validators.required],
        productId: [this.ProductId, Validators.required],
        stockUnitPrice: [pri, Validators.required],
        stockQuantity: [qnt, Validators.required],
      })
    );
  }
  DeleteProductStock(index: number) {
    this.ProductStocks.removeAt(index);
  }
  DeleteProductImage(index: number) {
    this.ProductImages.removeAt(index);
  }
  OnSubmit() {
    if (this.ProductForm.invalid) {
      this.ProductForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    formData.append('productName', this.ProductForm.value.productName);
    formData.append(
      'productDescription',
      this.ProductForm.value.productDescription
    );
    formData.append('supplierId', this.ProductForm.value.supplierId);
    formData.append('brandId', this.ProductForm.value.brandId);
    formData.append('categoryId', this.ProductForm.value.categoryId);
    let hasOldImages = false;
    let hasNewImages = false;
    this.ProductImages.controls.forEach((img: any) => {
      const file = img.get('productImage').value;
      if (this.ProductEntity) {
        if (file instanceof File) {
          formData.append('NewProductImages', file);
          hasNewImages = true;
        } else {
          formData.append('OldProductImages', file);
          hasOldImages = true;
        }
      } else {
        if (file instanceof File) {
          formData.append('productImages', file);
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
    this.ProductStocks.controls.forEach((stock: any, index: number) => {
      formData.append(
        `productStocks[${index}].inventoryId`,
        stock.value.inventoryId
      );
      formData.append(
        `productStocks[${index}].productId`,
        stock.value.productId
      );
      formData.append(
        `productStocks[${index}].stockUnitPrice`,
        stock.value.stockUnitPrice
      );
      formData.append(
        `productStocks[${index}].stockQuantity`,
        stock.value.stockQuantity
      );
    });

    const formSupplierData = new FormData();
    formSupplierData.append('productName', this.ProductForm.value.productName);
    formSupplierData.append(
      'productDescription',
      this.ProductForm.value.productDescription
    );
    formSupplierData.append('brandId', this.ProductForm.value.brandId);
    formSupplierData.append('categoryId', this.ProductForm.value.categoryId);
    formSupplierData.append('supplierId', this.ProductForm.value.supplierId);
    formSupplierData.append('inventoryId', this.closestInventoryId.toString());
    formSupplierData.append(
      'productPrice',
      this.ProductStocks.at(0).get('stockUnitPrice')?.value
    );
    formSupplierData.append(
      'productQuantity',
      this.ProductStocks.at(0).get('stockQuantity')?.value
    );
    this.ProductImages.controls.forEach((img: any) => {
      const file = img.get('productImage').value;
      if (file instanceof File) {
        formSupplierData.append('productImages', file);
      }
    });

    if (this.ProductId <= 0) {
      if (this.UserRole === 'Supplier') {
        this.productServ.AddReviewSuppliedProduct(formSupplierData).subscribe((res)=>{
          this.isLoading = false;
          this.ProductForm.reset();
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Product added successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.router.navigate(['/product/manage']);
        },
      (error)=>{
          this.isLoading = false;
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'error',
            title: 'Error while adding product',
            showConfirmButton: false,
            timer: 2500,
          });
      })
      } else {
        this.productServ.InsertProduct(formData).subscribe(
          (res) => {
            this.isLoading = false;
            this.ProductForm.reset();
            Swal.fire({
              toast: true,
              position: 'top',
              icon: 'success',
              title: 'Product added successfully',
              showConfirmButton: false,
              timer: 2500,
            });
            this.router.navigate(['/product/manage']);
          },
          (err) => {
            this.isLoading = false;
            Swal.fire({
              toast: true,
              position: 'top',
              icon: 'error',
              title: 'Error while adding product',
              showConfirmButton: false,
              timer: 2500,
            });
          }
        );
      }
    } else {
      this.productServ.UpdateProduct(this.ProductId, formData).subscribe(
        (res) => {
          this.isLoading = false;
          this.ProductForm.reset();
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Product updated successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.router.navigate(['/product/manage']);
        },
        (err) => {
          this.isLoading = false;
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'error',
            title: 'Error while updating product',
            showConfirmButton: false,
            timer: 2500,
          });
        }
      );
    }
  }

  // Working on GIS Location
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.CurrentUserLatitude = position.coords.latitude;
          this.CurrentUserLongitude = position.coords.longitude;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  findClosestInventory() {
    let closesetDistance = Infinity;
    this.InventoryArr.forEach((inventory) => {
      const distance = this.calculateDistance(
        this.CurrentUserLatitude,
        this.CurrentUserLongitude,
        inventory.lat,
        inventory.long
      );
      if (distance < closesetDistance) {
        closesetDistance = distance;
        this.closestInventoryId = inventory.inventoryId;
      }
    });
    this.setInventoryValue(this.closestInventoryId);
  }
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  setInventoryValue(inventoryId: number) {
    const inventoryControl = this.ProductForm.get('inventoryId');
    inventoryControl?.setValue(inventoryId);
  }
  // End Of Working On GIS
}
