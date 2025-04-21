import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Brand } from '../../../../models/brand';
import { CommonModule } from '@angular/common';
import { Inventory } from '../../../../models/inventory';
import { Product } from '../../../../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../services/auth.service';
import { SpinnerComponent } from '@coreui/angular';
@Component({
  selector: 'app-product-details',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
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
    private routes: ActivatedRoute,
    private fb: FormBuilder,
    private productServ: ProductService,
    private authServ: AuthService,
    private router: Router
  ) {
    // Get Product Id
    this.routes.paramMap.subscribe((id) => {
      this.ProductId = Number(id.get('id'));
    });
    // Get User Id && Role
    this.SupplierId = this.authServ.getUserId() ?? '';
    this.UserRole = this.authServ.getUserRoleFromToken() ?? '';
    // Get BrandArr
    this.productServ.GetBrandData().subscribe((res) => {
      this.BrandArr = res;
    });
    // Get CategoryArr
    this.productServ.GetSubCategories().subscribe((res) => {
      this.CategoryArr = res;
    });

    // Create InsertProductDTO Form
    this.ProductForm = this.fb.group({
      ProductName: ['', Validators.required],
      ProductDescription: ['', Validators.required],
      SupplierId: [this.SupplierId, Validators.required],
      BrandId: [0, Validators.required],
      CategoryId: [0, Validators.required],
      ProductImages: this.fb.array([]),
      ProductStocks: this.fb.array([]),
    });
  }

  ngOnInit() {
    // Get InventoryArr
    this.productServ.GetListOfInventory().subscribe((res) => {
      this.InventoryArr = res;
      // Get User Location
      this.getUserLocation();
    });
    this.isLoading = true;
    if (this.ProductId > 0) {
      this.productServ.GetById(this.ProductId).subscribe((res) => {
        this.ProductEntity = res;
        if (this.UserRole == 'Supplier') {
          if (this.ProductEntity.supplierId !== this.SupplierId) {
            this.ShowErrorMessage("You Can't Request This page");
            this.router.navigate(['/product']);
            this.isLoading = false;
          }
        }
        this.isLoading = true;
        this.ProductForm.patchValue({
          ProductName: this.ProductEntity.productName,
          ProductDescription: this.ProductEntity.productDescription,
          BrandId: this.ProductEntity.brandId,
          CategoryId: this.ProductEntity.categoryId,
        });
        this.isLoading = false;
        this.isLoading = true;
        this.ProductEntity.productImages.forEach((image: string) => {
          this.AddExistingImage(image);
          this.isLoading = false;
        });
      });
      this.isLoading = true;
      this.productServ.GetProductStock(this.ProductId).subscribe((res) => {
        res.forEach((product: any) => {
          this.AddExistingStock(
            product.stockQuantity,
            product.stockUnitPrice,
            product.inventoryId
          );
          this.isLoading = false;
        });
      });
    }
  }

  get ProductImages(): FormArray {
    return this.ProductForm.get('ProductImages') as FormArray;
  }
  get ProductStocks(): FormArray {
    return this.ProductForm.get('ProductStocks') as FormArray;
  }
  AddProductImage() {
    this.ProductImages.push(this.createImageGroup());
  }
  AddExistingImage(imagePath: string) {
    this.ProductImages.push(this.createImageGroup(imagePath));
  }
  createImageGroup(imagePath: string = '') {
    return this.fb.group({
      imageFile: [null],
      imagePreview: [imagePath],
    });
  }
  DeleteImage(index: number) {
    const file = this.ProductImages.at(index).get('imageFile')?.value;
    const preview = this.ProductImages.at(index).get('imagePreview')?.value;
    if (file == null && preview == '') {
      this.ProductImages.removeAt(index);
    } else if (file !== null && preview !== '') {
      this.ProductImages.removeAt(index);
    } else if (file == null && preview != '') {
      this.productServ.DeleteProductImage(this.ProductId, preview).subscribe(
        (res) => {
          this.ProductImages.removeAt(index);
        },
        (error) => {
          this.ShowErrorMessage('Failed To Delete Image');
        }
      );
    }
  }
  AddProductStock() {
    this.ProductStocks.push(this.createStockGroup());
  }
  AddExistingStock(stock: number, price: number, invId: number) {
    this.ProductStocks.push(this.createStockGroup(stock, price, invId));
  }
  createStockGroup(
    stock: number = 0,
    price: number = 0,
    invId: number = this.closestInventoryId
  ): FormGroup {
    return this.fb.group({
      InventoryId: [
        { value: invId, disabled: this.UserRole != 'Admin' },
        Validators.required,
      ],
      ProductId: [this.ProductId],
      StockUnitPrice: [price, Validators.required],
      StockQuantity: [stock, Validators.required],
    });
  }
  DeleteStock(index: number) {
    this.ProductStocks.removeAt(index);
  }
  onFileUpdate(event: Event, index: number) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imagePreview = reader.result as string;
        const imagesFormArray = this.ProductForm.get(
          'ProductImages'
        ) as FormArray;
        const imageGroup = imagesFormArray.at(index) as FormGroup;
        imageGroup.patchValue({
          imageFile: file,
          imagePreview: imagePreview,
        });
      };
      reader.readAsDataURL(file);
    }
  }
  ShowSuccessMessage(msg: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 2500,
    });
    this.isLoading = false;
  }
  ShowErrorMessage(msg: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: msg,
      showConfirmButton: false,
      timer: 2500,
    });
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    if (this.SupplierId) {
      if (this.UserRole) {
        if (this.ProductForm.valid) {
          if (this.ProductImages.length > 0) {
            if (this.ProductStocks.length > 0) {
              // Check Product Quantity For Supplier
              if (this.UserRole == 'Supplier') {
                if (
                  this.ProductStocks.at(0).get('StockUnitPrice')?.value == 0 ||
                  this.ProductStocks.at(0).get('StockQuantity')?.value == 0
                ) {
                  this.ShowErrorMessage(
                    'Please before continue you should enter the product quantity and price for selected inventory'
                  );
                }
              }
              // Create the FormData to Send to Backend

              const formData = new FormData();
              formData.append(
                'ProductName',
                this.ProductForm.get('ProductName')?.value
              );
              formData.append(
                'ProductDescription',
                this.ProductForm.get('ProductDescription')?.value
              );
              formData.append(
                'SupplierId',
                this.ProductForm.get('SupplierId')?.value
              );
              formData.append(
                'BrandId',
                this.ProductForm.get('BrandId')?.value
              );
              formData.append(
                'CategoryId',
                this.ProductForm.get('CategoryId')?.value
              );
              let imageIndex = 0;
              let oldImageIndex = 0;
              let newImageIndex = 0;

              this.ProductImages.controls.forEach((control) => {
                const file = control.get('imageFile')?.value;
                const preview = control.get('imagePreview')?.value;
                if (file instanceof File) {
                  if (this.ProductEntity) {
                    formData.append(`NewProductImages`, file);
                  } else {
                    formData.append(`ProductImages`, file);
                  }
                } else if (
                  typeof preview === 'string' &&
                  preview.trim() !== ''
                ) {
                  if (this.ProductEntity) {
                    formData.append(`OldProductImages`, preview);
                  } else {
                    formData.append(`OldImages`, preview);
                  }
                }
              });
              this.ProductStocks.controls.forEach((stock, index) => {
                const stockGroup = stock as FormGroup;
                const rawValue = stockGroup.getRawValue();
                formData.append(`ProductStocks[${index}].InventoryId`, rawValue.InventoryId);
                formData.append(`ProductStocks[${index}].ProductId`, rawValue.ProductId);
                formData.append(`ProductStocks[${index}].StockUnitPrice`, rawValue.StockUnitPrice);
                formData.append(`ProductStocks[${index}].StockQuantity`, rawValue.StockQuantity);
              });
              // End Of Creation of FormData
              if (this.ProductEntity) {
                // Update
                this.productServ.UpdateProduct(this.ProductId, formData).subscribe({
                  next: (res) => {
                    this.ShowSuccessMessage("Product Updated Successfully");
                    this.router.navigate(['/product']);
                  },
                  error: (err) => {
                    this.ShowErrorMessage("Update failed: " + err.error.message);
                  },
                  complete: () => this.isLoading = false
                });
              } else {
                // Insert
                if(this.UserRole == "Admin"){
                  this.productServ.InsertProduct(formData).subscribe({
                    next:(res) => {
                      this.ShowSuccessMessage('Product Successfull Created');
                    },
                    error:(err) => {
                      this.ShowErrorMessage(err.error.message);
                    },
                    complete:()=> this.router.navigate(['/product'])
                  });
                }else if(this.UserRole == "Supplier"){
                  let supplierInventoryId = this.ProductStocks.at(0).get('InventoryId')?.value
                  let productStock = this.ProductStocks.at(0).get('StockQuantity')?.value
                  let productPrice = this.ProductStocks.at(0).get('StockUnitPrice')?.value
                  formData.append('InventoryId',supplierInventoryId.toString())
                  formData.append('ProductQuantity',productStock.toString())
                  formData.append('ProductPrice',productPrice.toString())
                  this.productServ.AddReviewSuppliedProduct(formData).subscribe({
                    next:(res)=>{
                      this.ShowSuccessMessage("Product Successfull Created, and Waiting To Be Reviewed")
                    },
                    error:(err)=>{
                      this.ShowErrorMessage("Product Failed To Create");
                    },
                    complete:()=>{
                      this.router.navigate(['/product'])
                    }
                  })
                }
                
              }
            } else {
              this.ShowErrorMessage(
                'You should input at least 1 inventory stock for this product'
              );
              this.AddProductStock();
            }
          } else {
            this.ShowErrorMessage(
              'You should select at least 1 image for product'
            );
            this.AddProductImage();
          }
        } else {
          this.ShowErrorMessage(
            'The Model is Invalid, Please Fill All Requirements'
          );
        }
      } else {
        this.ShowErrorMessage("Can't Get User Role From Token");
      }
    } else {
      this.ShowErrorMessage("Can't Get User Id From Token");
    }
  }

  // Working on GIS Location
  getUserLocation() {
    if (navigator.geolocation) {
      this.isLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.CurrentUserLatitude = position.coords.latitude;
          this.CurrentUserLongitude = position.coords.longitude;
          this.findClosestInventory();
          this.isLoading = false;
        },
        (error) => {
          this.ShowErrorMessage('Error While trying to get you location');
        }
      );
    }
  }
  findClosestInventory() {
    this.isLoading = true;
    if (this.InventoryArr) {
      let closesetDistance = Infinity;
      this.InventoryArr.forEach((inventory) => {
        const distance = this.calculateDistance(
          this.CurrentUserLatitude,
          this.CurrentUserLongitude,
          inventory.lat,
          inventory.long
        );
        this.isLoading = false;
        if (distance < closesetDistance) {
          closesetDistance = distance;
          this.closestInventoryId = inventory.inventoryId;
        }
      });
      this.setInventoryValue(this.closestInventoryId);
      if (this.UserRole == 'Supplier') {
        this.AddProductStock();
      }
    }
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

