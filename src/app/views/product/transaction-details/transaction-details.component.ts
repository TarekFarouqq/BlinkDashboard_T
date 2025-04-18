import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../../services/auth.service';
import {InventoryService} from '../../../../services/inventory.service';
import { Inventory } from '../../../../models/inventory';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { TransactionHistoryService } from '../../../../services/transaction-history.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NgSelectModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.scss'
})
export class TransactionDetailsComponent implements OnInit {
  TransactionForm!:FormGroup;
  InventoryArr!:Inventory[];
  ProductArr!:Product[];
  CurrentUser:string | null;
  TransactionEntity!:any;
  isLoading=false
  TransactionId!:number;
  constructor(
    private fb:FormBuilder,
    private authServ:AuthService,
    private inventoryServ:InventoryService,
    private productServ:ProductService,
    private transactionServ:TransactionHistoryService,
    private routes:ActivatedRoute
  ){
    this.CurrentUser=this.authServ.getUserId() ?? null;
    this.routes.paramMap.subscribe((value)=>{
      this.TransactionId=Number(value.get('id'));
    })
    this.TransactionForm = this.fb.group({
      inventoryTransactionType: [3, Validators.required],
      transactionDetail: this.fb.group({
        userId: [this.CurrentUser, Validators.required],
        srcInventoryId: [0, Validators.required],
        distInventoryId: [0, Validators.required]
      }),
      transactionProducts: this.fb.array([])
    });
  }
  ngOnInit() {
    this.inventoryServ.getAll().subscribe((res)=>{
      this.InventoryArr=res;
    })
    this.productServ.GetAll().subscribe((res)=>{
      this.ProductArr=res;
    })
    this.transactionServ.GetTransactionHistoryById(this.TransactionId).subscribe((res)=>{
      this.TransactionEntity=res;
      this.TransactionDetail.patchValue({
        srcInventoryId: this.TransactionEntity.srcInventoryId,
        distInventoryId: this.TransactionEntity.distInventoryId
      });
      this.TransactionEntity.transactionProducts.forEach((product:any)=>{
        this.AddExistingProduct(product.productId,product.transactionQuantity);
      })
    })
  }
  get TransactionDetail():FormGroup{
    return this.TransactionForm.get('transactionDetail') as FormGroup;
  }
  get TransactionProducts():FormArray{
    return this.TransactionForm.get('transactionProducts') as FormArray;
  }
  AddTransactionDetails(srcId:number,destId:number){
    // console.log(srcId);
    // console.log(destId);
    this.TransactionDetail.patchValue({
      srcInventoryId:[srcId,Validators.required],
      distInventoryId:[destId,Validators.required]
    })
  }
  AddTransactionProduct(){
    this.TransactionProducts.push(this.fb.group({
      transactionQuantity:[0,Validators.required],
      productId: [0, Validators.required]
    }))
  }
  AddExistingProduct(prdId:number,quantity:number){
    if(quantity > 0 ){
      this.TransactionProducts.push(this.fb.group({
        transactionQuantity:[quantity??0,Validators.required],
        productId: [prdId, Validators.required]
      }))
    }
  }
  DeleteProduct(index:number){
    this.TransactionProducts.removeAt(index);
  }
  AddAllProducts(){
    let srcId = this.TransactionDetail.get('srcInventoryId')?.value
    if(srcId){
      if(srcId > 0 ){
        this.ProductArr.forEach((product)=>{
          this.productServ.GetProductStockInInventory(srcId,product.productId).subscribe((res)=>{
            this.AddExistingProduct(product.productId,res);
          });
        })
      }
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
  onSubmit(){
    this.isLoading=true
    let srcInventoryId = this.TransactionDetail.get('srcInventoryId')?.value;
    let destInventoryId = this.TransactionDetail.get('distInventoryId')?.value;
    if(this.TransactionForm.valid){
      if(srcInventoryId && destInventoryId){
        if(srcInventoryId !== destInventoryId){
          if(this.TransactionEntity){
            //Update
            const payLoad = this.TransactionForm.value
            this.transactionServ.UpdateTransaction(this.TransactionId,payLoad).subscribe((res)=>{
              this.ShowSuccessPanel("Transaction Updated Successfull");
            })
          }else{
            //Insert
            const payLoad = this.TransactionForm.value
            this.transactionServ.CreateTransaction(payLoad).subscribe((res)=>{
              this.ShowSuccessPanel("Transaction Created Successfull");
            })
          }
        }else{
          this.ShowErrorPanel("Can't Transfer Products On The Same Inventories");
        }
      }else{
        this.ShowErrorPanel("Please Select Inventories Before Continue");
      }
    }else{
      this.ShowErrorPanel("Form isnot Valid");
    }
  }

}