import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '@coreui/angular';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { catchError, debounceTime, distinctUntilChanged, find, of, Subject, switchMap, tap } from 'rxjs';
import {DiscountService} from '../../../../services/discount.service';
import {ReadDiscountDetailsDTO} from '../../../../models/read-discount-details-dto'
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
  isLoading: boolean = true;
  DiscountForm!: FormGroup;
  DiscountId!: number;
  BrandArr!: any[];
  CategoryArr!: any[];
  InventoryArr!: any[];
  ProductArr!:any[];
  DiscountEntity!:ReadDiscountDetailsDTO;
  productInput$ = new Subject<string>();
  constructor(
    private fb: FormBuilder,
    private routes: ActivatedRoute,
    private productServ: ProductService,
    private discountServ:DiscountService,
    private router:Router
  ) {
    this.routes.paramMap.subscribe((value) => {
      this.DiscountId = Number(value.get('id'));
    });
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const endDate = endOfMonth.toLocaleDateString('en-CA');
    this.DiscountForm = this.fb.group({
      DiscountPercentage: [1, Validators.required],
      DiscountFromDate: [startDate,Validators.required,],
      DiscountEndDate: [endDate, Validators.required],
      Select1: [1],
      Select2: [1],
      InsertProductDiscountDetails: this.fb.array([],Validators.required),
    });
  }
  ngOnInit() {
    this.setupProductSearch();
    this.isLoading = true;
    this.productServ.GetBrandData().subscribe({
      next: (res) => {
        this.BrandArr = res;
        this.isLoading = false;
      },
      error: () => {
        this.ShowErrorPanel('Failed To Get Brand Data From Server');
      },
    });
    this.isLoading = true;
    this.productServ.GetSubCategories().subscribe({
      next: (res) => {
        this.CategoryArr = res;
        this.isLoading = false;
      },
      error: () => {
        this.ShowErrorPanel('Failed To Get Category Data from Server');
      },
    });
    this.isLoading = true;
    this.productServ.GetListOfInventory().subscribe({
      next: (res) => {
        this.InventoryArr = res;
        this.isLoading = false;
      },
      error: () => {
        this.ShowErrorPanel('Failed To Get Inventory Data From Server');
      },
    });
    this.isLoading=true;
    this.productServ.GetPagginatedProducts(1,20).subscribe({
      next:(res)=>{
        this.ProductArr=res;
        this.isLoading=true;
    if(this.DiscountId > 0 ){
      this.discountServ.GetDiscountById(this.DiscountId).subscribe({
        next:(res)=>{
          this.DiscountEntity=res;
          this.DiscountForm.patchValue({
            DiscountPercentage:[this.DiscountEntity.discountPercentage],
            DiscountFromDate:[this.formatDateForInput(new Date(this.DiscountEntity.discountFromDate))],
            DiscountEndDate:[this.formatDateForInput(new Date(this.DiscountEntity.discountEndDate))]
          })
          this.DiscountEntity.readProductsDiscountDTOs.forEach((product)=>{
            this.CreateDiscountProduct(product.productId,product.discountAmount)
          })
          this.isLoading=false;
        },
        error:()=>{
          this.ShowErrorPanel("Failed To Get Discount Details From Server");
        }
      })
    }
        this.isLoading=false;
      },
      error:()=>{
        this.ShowErrorPanel("Failed To Get Product Data From Server");
      }
    })
    this.isLoading = false;
  }
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  get DiscountProducts():FormArray{
    return this.DiscountForm.get('InsertProductDiscountDetails') as FormArray
  }
  DeleteAllDiscountProducts(){
    this.DiscountProducts.clear();
  }
  DeleteDiscountProduct(index:number){
    this.DiscountProducts.removeAt(index);
  }
  CreateDiscountProduct(prdId:number=0,amount:number=0){
    this.isLoading=true
    if(prdId > 0 ){
      this.productServ.GetById(prdId).subscribe({
        next:(res)=>{
          let tempProductEntity = res;
          let disPercentage:number = this.DiscountForm.get('DiscountPercentage')?.value
          amount=tempProductEntity.productPrice * (disPercentage / 100)
        }
      })
    }
    let findedProduct = this.ProductArr.find(prd=>prd.productId==prdId)
    if(prdId > 0 ){
      if(!findedProduct){
        this.productServ.GetById(prdId).subscribe({
          next:(response)=>{
            this.ProductArr.push(response);
            let discountGroup = this.fb.group({
              productId:[prdId,Validators.required],
              discountAmount:[amount,Validators.required]
            });
            discountGroup.get('productId')?.valueChanges.subscribe((selectedProductId)=>{
              let selectedProduct = this.ProductArr.find(p=>p.productId===selectedProductId);
              if(selectedProduct){
                const percentage = this.DiscountForm.get('DiscountPercentage')?.value || 0 ;
                const calculatedDiscount = selectedProduct.productPrice * ( percentage / 100 );
                discountGroup.get('discountAmount')?.setValue(calculatedDiscount,{ emitEvent: false })
              }
            })
            this.DiscountProducts.push(discountGroup);
          }
        })
      }else{
        let discountGroup = this.fb.group({
          productId:[prdId,Validators.required],
          discountAmount:[amount,Validators.required]
        });
        discountGroup.get('productId')?.valueChanges.subscribe((selectedProductId)=>{
          let selectedProduct = this.ProductArr.find(p=>p.productId===selectedProductId);
          if(selectedProduct){
            const percentage = this.DiscountForm.get('DiscountPercentage')?.value || 0 ;
            const calculatedDiscount = selectedProduct.productPrice * ( percentage / 100 );
            discountGroup.get('discountAmount')?.setValue(calculatedDiscount,{ emitEvent: false })
          }
        })
        this.DiscountProducts.push(discountGroup);
      }
    }else{
      let discountGroup = this.fb.group({
        productId:[prdId,Validators.required],
        discountAmount:[amount,Validators.required]
      });
      discountGroup.get('productId')?.valueChanges.subscribe((selectedProductId)=>{
        let selectedProduct = this.ProductArr.find(p=>p.productId===selectedProductId);
        if(selectedProduct){
          const percentage = this.DiscountForm.get('DiscountPercentage')?.value || 0 ;
          const calculatedDiscount = selectedProduct.productPrice * ( percentage / 100 );
          discountGroup.get('discountAmount')?.setValue(calculatedDiscount,{ emitEvent: false })
        }
      })
      this.DiscountProducts.push(discountGroup);

    }
    this.isLoading=false;
  }
  AddDiscountProduct(){
    this.CreateDiscountProduct();
  }
  AddAllProducts(){
    this.isLoading=true
    let select1Value = this.DiscountForm.get('Select1')?.value;
    let select2Value = this.DiscountForm.get('Select2')?.value;
    let discount:number = this.DiscountForm.get('DiscountPercentage')?.value;
    this.DiscountProducts.clear();
    if(select1Value > 0 && select2Value > 0 && discount > 0){
      switch(select1Value.toString()){
        case '1':
          //
          console.log('start');
          this.productServ.FilterByBrand(select2Value).subscribe({
              next:(res)=>{
               if(res.length > 0 ){
                res.forEach((product)=>{
                  let discountPrice = product.productPrice * (discount / 100);
                  this.CreateDiscountProduct(product.productId,discountPrice);
                })
                this.isLoading=false;
               }else{
                this.ShowErrorPanel("No Products For Selected Brand");
               }
              }
            })
          return;
        case '2':
          //ByCategory
          this.productServ.FilterByCategory(select2Value).subscribe({
            next:(res)=>{
              if(res.length> 0 ){
                res.forEach((product)=>{
                  let discountPrice = product.productPrice * (discount / 100);
                  this.CreateDiscountProduct(product.productId,discountPrice);
                })
                this.isLoading=false;
              }else{
                this.ShowErrorPanel("No Products For Selected Brand");
              }
            }
          })
          return;
        default:
          return;
      }
    }else{
      this.ShowErrorPanel("All Requirements to Filter Products are not set");
    }
  }
  SearchProducts(index:number){
    let searchText:string= this.DiscountProducts.at(index).get('searchText')?.value
    this.productServ.SearchProducts(searchText).subscribe({
      next:(res)=>{
        this.ProductArr=res;
      }
    })
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
  setupProductSearch() {
    this.productInput$.pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      tap(),
      switchMap(searchTerm => this.productServ.SearchProducts(searchTerm).pipe(
        catchError(() => of([])),
        tap()
      ))
    ).subscribe(results => {
      this.ProductArr = results;
    });
  }
  onSubmit(){
    this.isLoading=true
    if(this.DiscountForm.valid){
      const formData=new FormData();
      formData.append('DiscountPercentage',this.DiscountForm.get('DiscountPercentage')?.value)
      formData.append('DiscountFromDate',this.DiscountForm.get('DiscountFromDate')?.value)
      formData.append('DiscountEndDate',this.DiscountForm.get('DiscountEndDate')?.value)
      this.DiscountProducts.controls.forEach((product,index)=>{
        formData.append(`InsertProductDiscountDetails[${index}].ProductId`,product.get('productId')?.value)
        formData.append(`InsertProductDiscountDetails[${index}].DiscountAmount`,product.get('discountAmount')?.value)
        formData.append(`UpdateProductDiscountDetails[${index}].ProductId`,product.get('productId')?.value)
        formData.append(`UpdateProductDiscountDetails[${index}].DiscountAmount`,product.get('discountAmount')?.value)
      })
      if(this.DiscountEntity){
        //Update
        formData.append('DiscountId',this.DiscountId.toString());
        this.discountServ.UpdateDiscount(formData).subscribe({
          next:()=>{
            this.ShowSuccessPanel("Discount Updated Successfull");
            this.router.navigate(['/product/manage-discounts']);
          },
          error:()=>{
            this.ShowErrorPanel("Discount Update Failed");
          }
        })
      }else{
        //Insert
        this.discountServ.CreateDiscount(formData).subscribe({
          next:()=>{
            this.ShowSuccessPanel("Discount Created Successfull");
            this.router.navigate(['/product/manage-discounts']);
          },
          error:()=>{
            this.ShowErrorPanel("Discount Failed To Create");
          }
        })
      }
    }else{
      this.ShowErrorPanel("Form isn't Valid, All Inputs Are Required")
    }
  }
}
