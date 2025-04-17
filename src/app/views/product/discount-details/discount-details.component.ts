import { Component, OnInit } from '@angular/core';
import { ReadDiscountDetailsDTO } from '../../../../models/read-discount-details-dto';
import { DiscountService } from '../../../../services/discount.service';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../../services/brand.service';
import { CategoryService } from '../../../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Brand } from '../../../../models/brand';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';
import { BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { producerUpdateValueVersion } from '@angular/core/primitives/signals';
@Component({
  selector: 'app-discount-details',
  imports: [CommonModule, FormsModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './discount-details.component.html',
  styleUrl: './discount-details.component.scss',
})
export class DiscountDetailsComponent implements OnInit {
  DiscountEntity!: ReadDiscountDetailsDTO;
  DiscountId!: number;
  SelectedFilter: number=0;
  BrandArr!: Brand[];
  CategoryArr!: Category[];
  ProductArr!: Product[];
  SelectedFilterId=new BehaviorSubject<number | null>(null);
  DiscountForm!:FormGroup;
  constructor(
    private discountServ: DiscountService,
    private routes: ActivatedRoute,
    private categoryServ: CategoryService,
    private brandServ: BrandService,
    private productServ: ProductService,
    private fb:FormBuilder
  ) {
    this.routes.paramMap.subscribe((value) => {
      this.DiscountId = Number(value.get('id'));
    });
    this.DiscountForm=this.fb.group({
      discountPercentage: [15, Validators.required],
      discountFromDate: [null, Validators.required],
      discountEndDate: [null, Validators.required],
      insertProductDiscountDetails:this.fb.array([])
    });
  }
  get DiscountProducts():FormArray{
    return this.DiscountForm.get('insertProductDiscountDetails') as FormArray
  }
  ngOnInit() {
    if (this.DiscountId > 0) {
      // Update
      this.discountServ.GetDiscountById(this.DiscountId).subscribe((res) => {
        this.DiscountEntity = res;
        this.DiscountEntity.discountFromDate = new Date(this.DiscountEntity.discountFromDate);
        this.DiscountEntity.discountEndDate = new Date(this.DiscountEntity.discountEndDate);
        this.DiscountForm.patchValue({
          discountPercentage:this.DiscountEntity.discountPercentage,
          discountFromDate:this.DiscountEntity.discountFromDate.toISOString().split('T')[0],
          discountEndDate:this.DiscountEntity.discountEndDate.toISOString().split('T')[0],
        })
        this.DiscountEntity.readProductsDiscountDTOs.forEach((product)=>{
          this.AddExistingProduct(product.productId,product.discountAmount);
        })
      });
    }
    this.productServ.GetAll().subscribe((res)=>{
      this.ProductArr=res;
    })
    this.SelectedFilterId.subscribe((res)=>{
      let CurrentId = Number(res);
      if(CurrentId > 0) {
        // console.log(CurrentId);
      }
    })
  }
  AddExistingProduct(prdId: number, disAmount: number) {
    this.DiscountProducts.push(
      this.fb.group({
        productId: [prdId, Validators.required],
        // discountAmount: [disAmount, Validators.required],
        discountAmount: new FormControl({
          value:disAmount,
          disabled:true
        },[Validators.required]),
      })
    );
  }
  AddNewProduct() {
    this.DiscountProducts.push(
      this.fb.group({
        productId: [0, Validators.required],
        // discountAmount: [disAmount, Validators.required],
        discountAmount: new FormControl({
          value:0,
          disabled:true
        },[Validators.required]),
      })
    );
  }
  ChangeProductDiscountAmount(index:number){
    let prdId = (this.DiscountProducts.at(index) as FormGroup).get('productId')?.value;
    let productPrice = this.ProductArr.find(p=>p.productId==prdId)?.productPrice
    if (productPrice !== undefined) {
      const discountPercentage = this.DiscountForm.controls['discountPercentage']?.value;
      const discountAmount = productPrice * (discountPercentage / 100);
      (this.DiscountProducts.at(index) as FormGroup).get('discountAmount')?.setValue(discountAmount);
    } else {
      console.warn(`Product with ID ${prdId} not found in ProductArr`);
    }
  }
  CreateFilterSelect() {
    const parentObj = document.getElementById('input-method');
    if(parentObj){
      parentObj.innerHTML='';
    }
    if (parentObj) {
      if (this.SelectedFilter == 1) {
        //Category
        this.categoryServ.GetAll().subscribe((res) => {
          this.CategoryArr = res;
          const selectObj = document.createElement('select');
          selectObj.className = 'form-select';
          selectObj.addEventListener('change', (event) => {
            const target = event.target as HTMLSelectElement;
            this.SelectedFilterId.next(+target.value) 
          });
          this.CategoryArr.forEach((category) => {
            category.subCategories.forEach((subCategory) => {
              const optionObj = document.createElement('option');
              optionObj.value = subCategory.categoryId.toString();
              optionObj.text = subCategory.categoryName;
              selectObj.appendChild(optionObj);
            });
          });
          this.SelectedFilterId.next(this.CategoryArr[0].subCategories[0].categoryId)
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
            this.SelectedFilterId.next(+target.value) 
          });
          this.BrandArr.forEach((brand) => {
            const optionObj = document.createElement('option');
            optionObj.value = brand.brandId.toString();
            optionObj.text = brand.brandName;
            selectObj.appendChild(optionObj);
          });
          this.SelectedFilterId.next(this.BrandArr[0].brandId)
          parentObj.appendChild(selectObj);
        });
      }
    }
  }
  deleteProduct(id:number){
    this.DiscountProducts.removeAt(id);
  }
  AddGroup(){
    this.SelectedFilterId.subscribe((res)=>{
      let CurrentId = Number(res);
      console.log(CurrentId);
    })
  }
}
