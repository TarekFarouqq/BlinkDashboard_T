import { Component, OnInit } from '@angular/core';
import { ReadDiscountDetailsDTO } from '../../../../models/read-discount-details-dto';
import { DiscountService } from '../../../../services/discount.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../../services/brand.service';
import { CategoryService } from '../../../../services/category.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '@coreui/angular';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Brand } from '../../../../models/brand';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';
import { BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-discount-details',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SpinnerComponent,
  ],
  templateUrl: './discount-details.component.html',
  styleUrl: './discount-details.component.scss',
})
export class DiscountDetailsComponent implements OnInit {
  DiscountEntity!: ReadDiscountDetailsDTO;
  DiscountId!: number;
  SelectedFilter: number = 0;
  BrandArr!: Brand[];
  CategoryArr!: Category[];
  ProductArr!: Product[];
  SelectedFilterId = new BehaviorSubject<number | null>(null);
  DiscountForm!: FormGroup;
  isLoading: boolean = true;
  constructor(
    private discountServ: DiscountService,
    private routes: ActivatedRoute,
    private categoryServ: CategoryService,
    private brandServ: BrandService,
    private productServ: ProductService,
    private fb: FormBuilder,
    private router:Router
  ) {
    this.routes.paramMap.subscribe((value) => {
      this.DiscountId = Number(value.get('id'));
    });
    this.DiscountForm = this.fb.group({
      discountPercentage: [15, Validators.required],
      discountFromDate: [null, Validators.required],
      discountEndDate: [null, Validators.required],
      insertProductDiscountDetails: this.fb.array([]),
    });
  }
  get DiscountProducts(): FormArray {
    return this.DiscountForm.get('insertProductDiscountDetails') as FormArray;
  }
  ngOnInit() {
    if (this.DiscountId > 0) {
      // Update
      this.discountServ.GetDiscountById(this.DiscountId).subscribe((res) => {
        this.DiscountEntity = res;
        console.log(this.DiscountEntity);
        this.DiscountEntity.discountFromDate = new Date(
          this.DiscountEntity.discountFromDate
        );
        this.DiscountEntity.discountEndDate = new Date(
          this.DiscountEntity.discountEndDate
        );
        this.DiscountForm.patchValue({
          discountPercentage: this.DiscountEntity.discountPercentage,
          discountFromDate: this.DiscountEntity.discountFromDate
            .toISOString()
            .split('T')[0],
          discountEndDate: this.DiscountEntity.discountEndDate
            .toISOString()
            .split('T')[0],
        });
        this.DiscountEntity.readProductsDiscountDTOs.forEach((product) => {
          this.AddExistingProduct(product.productId, product.discountAmount);
        });
      });
    }
    this.productServ.GetAll().subscribe((res) => {
      this.ProductArr = res;
    });
    this.isLoading = false;
  }
  AddExistingProduct(prdId: number, disAmount: number) {
    this.DiscountProducts.push(
      this.fb.group({
        productId: [prdId, Validators.required],
        // discountAmount: [disAmount, Validators.required],
        discountAmount: new FormControl(
          {
            value: disAmount,
            disabled: true,
          },
          [Validators.required]
        ),
      })
    );
  }
  AddNewProduct() {
    this.DiscountProducts.push(
      this.fb.group({
        productId: [0, Validators.required],
        discountAmount: new FormControl(
          {
            value: 0,
            disabled: true,
          },
          [Validators.required]
        ),
      })
    );
  }
  AddFromGroupProduct(prdId: number) {
    let ProductPrice = this.ProductArr.find(
      (prd) => prd.productId == prdId
    )?.productPrice;
    let discountPercentage = this.DiscountForm.get('discountPercentage')?.value;
    let discountAmount =
      (ProductPrice ?? 0) * ((discountPercentage ?? 0) / 100);
    this.DiscountProducts.push(
      this.fb.group({
        productId: [prdId, Validators.required],
        discountAmount: new FormControl(
          {
            value: discountAmount,
            disabled: true,
          },
          [Validators.required]
        ),
      })
    );
  }
  ChangeProductDiscountAmount(index: number) {
    let prdId = (this.DiscountProducts.at(index) as FormGroup).get(
      'productId'
    )?.value;
    let productPrice = this.ProductArr.find(
      (p) => p.productId == prdId
    )?.productPrice;
    if (productPrice !== undefined) {
      const discountPercentage =
        this.DiscountForm.controls['discountPercentage']?.value;
      const discountAmount = productPrice * (discountPercentage / 100);
      (this.DiscountProducts.at(index) as FormGroup)
        .get('discountAmount')
        ?.setValue(discountAmount);
    } else {
      console.warn(`Product with ID ${prdId} not found in ProductArr`);
    }
  }
  CreateFilterSelect() {
    const parentObj = document.getElementById('input-method');
    if (parentObj) {
      parentObj.innerHTML = '';
    }
    if (parentObj) {
      if (this.SelectedFilter == 1) {
        //Category
        this.categoryServ.GetAll(1,1000).subscribe((res) => {
          this.CategoryArr = res;
          const selectObj = document.createElement('select');
          selectObj.className = 'form-select';
          selectObj.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            this.SelectedFilterId.next(+target.value);
          });
          this.CategoryArr.forEach((category) => {
            category.subCategories.forEach((subCategory) => {
              const optionObj = document.createElement('option');
              optionObj.value = subCategory.categoryId.toString();
              optionObj.text = subCategory.categoryName;
              selectObj.appendChild(optionObj);
            });
          });
          this.SelectedFilterId.next(
            this.CategoryArr[0].subCategories[0].categoryId
          );
          parentObj.appendChild(selectObj);
        });
      } else if (this.SelectedFilter == 2) {
        // Brand
        this.brandServ.getAllBrands().subscribe((res) => {
          this.BrandArr = res;
          const selectObj = document.createElement('select');
          selectObj.className = 'form-select';
          selectObj.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            this.SelectedFilterId.next(+target.value);
          });
          this.BrandArr.forEach((brand) => {
            const optionObj = document.createElement('option');
            optionObj.value = brand.brandId.toString();
            optionObj.text = brand.brandName;
            selectObj.appendChild(optionObj);
          });
          this.SelectedFilterId.next(this.BrandArr[0].brandId);
          parentObj.appendChild(selectObj);
        });
      }
    }
  }
  deleteProduct(id: number) {
    this.DiscountProducts.removeAt(id);
  }
  ClearProducts() {
    this.DiscountProducts.clear();
  }
  AddGroup() {
    let CurrentId = 0;
    this.SelectedFilterId.subscribe((res) => {
      CurrentId = Number(res);
    });
    switch (this.SelectedFilter) {
      case 0:
        this.ProductArr.forEach((product) => {
          this.AddFromGroupProduct(product.productId);
        });
        return;
      case 1:
        let resultPWCArr = this.ProductArr.filter((product) => {
          return product.categoryId == CurrentId;
        });
        if (resultPWCArr.length == 0) {
          this.ShowErrorPanel('No Products Found In Selected Category');
          return;
        }
        resultPWCArr.forEach((product) => {
          this.AddFromGroupProduct(product.productId);
        });
        return;
      case 2:
        let resultPWBArr = this.ProductArr.filter((product) => {
          return product.brandId == CurrentId;
        });
        if (resultPWBArr.length == 0) {
          this.ShowErrorPanel('No Products Found In Selected Category');
          return;
        }
        resultPWBArr.forEach((product) => {
          this.AddFromGroupProduct(product.productId);
        });
        return;
      default:
        return;
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
  onSubmit() {
    this.isLoading=true
    if (this.DiscountEntity){
      const payLoad={
        discountId:this.DiscountId,
        discountPercentage:this.DiscountForm.value.discountPercentage,
        discountFromDate:this.DiscountForm.value.discountFromDate,
        discountEndDate:this.DiscountForm.value.discountEndDate,
        updateProductDiscountDetails: this.DiscountProducts.getRawValue()
      }
      this.discountServ.UpdateDiscount(payLoad).subscribe((res)=>{
        this.ShowSuccessPanel('Discount Updated Successfull');
        this.router.navigate(['/product/manage-discounts'])
      },(err)=>{
        this.ShowErrorPanel('Discount Failed To Update');
      })
    }else{
      const payLoad={
        discountPercentage:this.DiscountForm.value.discountPercentage,
        discountFromDate:this.DiscountForm.value.discountFromDate,
        discountEndDate:this.DiscountForm.value.discountEndDate,
        insertProductDiscountDetails: this.DiscountProducts.getRawValue()
      }
      this.discountServ.CreateDiscount(payLoad).subscribe((res)=>{
        this.ShowSuccessPanel('Discount Created Successfull');
        this.router.navigate(['/product/manage-discounts'])
      },(err)=>{
        this.ShowErrorPanel('Discount Failed To Create');
      })
    }
  }
}

