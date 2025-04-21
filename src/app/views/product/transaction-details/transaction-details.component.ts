import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { Inventory } from '../../../../models/inventory';
import { ProductService } from '../../../../services/product.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { TransactionHistoryService } from '../../../../services/transaction-history.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
@Component({
  selector: 'app-transaction-details',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SpinnerComponent,
  ],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.scss',
})
export class TransactionDetailsComponent implements OnInit {
  TransactionForm!: FormGroup;
  InventoryArr!: Inventory[];
  ProductArr!: any[];
  CurrentUser: string | null;
  TransactionEntity!: any;
  isLoading = false;
  TransactionId!: number;
  productInput$ = new Subject<string>();
  constructor(
    private fb: FormBuilder,
    private authServ: AuthService,
    private productServ: ProductService,
    private transactionServ: TransactionHistoryService,
    private routes: ActivatedRoute,
    private router:Router
  ) {
    this.CurrentUser = this.authServ.getUserId() ?? null;
    this.routes.paramMap.subscribe((value) => {
      this.TransactionId = Number(value.get('id'));
    });
    this.TransactionForm = this.fb.group({
      inventoryTransactionType: [3, Validators.required],
      transactionDetail: this.fb.group({
        userId: [this.CurrentUser, Validators.required],
        srcInventoryId: [0, Validators.required],
        distInventoryId: [0, Validators.required],
      }),
      transactionProducts: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.productServ.GetListOfInventory().subscribe((res) => {
      this.InventoryArr = res;
    });
    if (this.TransactionId > 0) {
      this.transactionServ
        .GetTransactionHistoryById(this.TransactionId)
        .subscribe((res) => {
          this.TransactionEntity = res;
          this.TransactionDetail.patchValue({
            srcInventoryId: this.TransactionEntity.srcInventoryId,
            distInventoryId: this.TransactionEntity.distInventoryId,
          });
          this.productServ.FilterByInventory(this.TransactionEntity.srcInventoryId).subscribe({
            next:(res)=>{
              this.ProductArr=res;
            }
          })
          this.TransactionEntity.transactionProducts.forEach((product: any) => {
            this.AddExistingProduct(
              product.productId,
              product.transactionQuantity
            );
          });
        });
    }
    this.setupProductSearch();
  }
  get TransactionDetail(): FormGroup {
    return this.TransactionForm.get('transactionDetail') as FormGroup;
  }
  get TransactionProducts(): FormArray {
    return this.TransactionForm.get('transactionProducts') as FormArray;
  }
  AddTransactionDetails(srcId: number, destId: number) {
    this.TransactionDetail.patchValue({
      srcInventoryId: [srcId],
      distInventoryId: [destId],
    });
  }
  AddTransactionProduct() {
    const srcId: number = Number(
      this.TransactionDetail.get('srcInventoryId')?.value
    );
    if (srcId > 0) {
      this.TransactionProducts.push(
        this.fb.group({
          transactionQuantity: [0, Validators.required],
          productId: [0, Validators.required],
        })
      );
    } else {
      this.ShowErrorPanel('Please Select Source Inventory First');
    }
  }
  AddExistingProduct(prdId: number, quantity: number) {
    if (quantity > 0) {
      this.TransactionProducts.push(
        this.fb.group({
          transactionQuantity: [quantity ?? 0, Validators.required],
          productId: [prdId, Validators.required],
        })
      );
    }
  }
  DeleteProduct(index: number) {
    this.TransactionProducts.removeAt(index);
  }
  AddAllProducts() {
    this.isLoading = true;
    this.TransactionProducts.clear();
    const srcId: number = Number(
      this.TransactionDetail.get('srcInventoryId')?.value
    );
    if (srcId > 0) {
      const stockMap = new Map<number, number>();
      setTimeout(() => {
        let takeFirst2000: boolean = this.ProductArr.length > 2000;
        let loopArr = takeFirst2000 ? this.ProductArr.slice(0,2000) : this.ProductArr
        console.log(loopArr);
        loopArr.forEach((product)=>{
          const stock = product.stockProductInventories?.find((res:any)=>res.inventoryId === srcId);
          if (stock && stock.stockQuantity > 0) {
            stockMap.set(product.productId, stock.stockQuantity);
          }
        })
        stockMap.forEach((quantity,productId)=>{
          this.AddExistingProduct(productId,quantity);
        })
        this.isLoading=false;
      }, 1000);
    } else {
      this.ShowErrorPanel('Please Select Source Inventory First');
    }
  }
  changeSourceInventory() {
    this.isLoading = true;
    let srcId: number = Number(
      this.TransactionDetail.get('srcInventoryId')?.value
    );
    if (srcId > 0) {
      this.productServ.FilterByInventory(srcId).subscribe({
        next: (res) => {
          this.ProductArr = res.slice(0,2000);
          this.isLoading = false;
        },
        error: () => {
          this.ShowErrorPanel('Failed To Get Product Data From Server');
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
  onSubmit() {
    this.isLoading = true;
    let srcInventoryId = this.TransactionDetail.get('srcInventoryId')?.value;
    let destInventoryId = this.TransactionDetail.get('distInventoryId')?.value;
    if (this.TransactionForm.valid) {
      if (srcInventoryId && destInventoryId) {
        if (srcInventoryId !== destInventoryId) {
          if (this.TransactionEntity) {
            //Update
            const payLoad = this.TransactionForm.value;
            this.transactionServ
              .UpdateTransaction(this.TransactionId, payLoad)
              .subscribe((res) => {
                this.ShowSuccessPanel('Transaction Updated Successfull');
                this.router.navigate(['/product/manage-transaction'])
            });
          } else {
            //Insert
            const payLoad = this.TransactionForm.value;
            this.transactionServ.CreateTransaction(payLoad).subscribe((res) => {
              this.ShowSuccessPanel('Transaction Created Successfull');
              this.router.navigate(['/product/manage-transaction'])
            });
          }
        } else {
          this.ShowErrorPanel(
            "Can't Transfer Products On The Same Inventories"
          );
        }
      } else {
        this.ShowErrorPanel('Please Select Inventories Before Continue');
      }
    } else {
      this.ShowErrorPanel('Form isnot Valid');
    }
  }
  setupProductSearch() {
    const srcId: number = Number(
      this.TransactionDetail.get('srcInventoryId')?.value
    );
    this.productInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(),
        switchMap((searchTerm) =>
          this.productServ.SearchProductsByInventory(searchTerm,srcId).pipe(
            catchError(() => of([])),
            tap()
          )
        )
      )
      .subscribe((results) => {
        console.log(results);
        this.ProductArr = results;
      });
  }
}
