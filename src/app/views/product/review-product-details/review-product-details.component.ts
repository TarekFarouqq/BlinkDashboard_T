import { booleanAttribute, Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewProductsService } from '../../../../services/review-products.service';
import { ReviewSuppliedProducts } from '../../../../models/review-supplied-products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventory } from '../../../../models/inventory';
import { Brand } from '../../../../models/brand';
import { InventoryService } from '../../../../services/inventory.service';
import { BrandService } from '../../../../services/brand.service';
import { ProductService } from '../../../../services/product.service';
import { UpdateReviewSuppliedProduct } from '../../../../models/update-review-supplied-product';

@Component({
  selector: 'app-review-product-details',
  imports: [SpinnerComponent,FormsModule,CommonModule],
  templateUrl: './review-product-details.component.html',
  styleUrl: './review-product-details.component.scss'
})
export class ReviewProductDetailsComponent implements OnInit{
  RequestId!:number;
  ReviewProductEntity!:ReviewSuppliedProducts;
  isLoading:boolean=true;
  CurrentPreviewImage:string='';
  InventryArr!:Inventory[];
  BrandArr!:Brand[];
  CategoryArr!:any[];
  constructor(
    private routes:ActivatedRoute,
    private reviewProductServ:ReviewProductsService,
    private inventoryServ:InventoryService,
    private brandServ:BrandService,
    private productServ:ProductService,
    private router:Router
  ){
    this.routes.paramMap.subscribe((id)=>{
      this.RequestId=Number(id.get('id'));
      this.reviewProductServ.GetReviewProductsByRequestId(this.RequestId).subscribe((res)=>{
        this.ReviewProductEntity=res;
        if(this.ReviewProductEntity.productImages.length > 0 ){
          this.CurrentPreviewImage=this.ReviewProductEntity.productImages[0].imageUrl;
        }
      }); 
    })
  }
  ngOnInit(){
    this.inventoryServ.getAll().subscribe((res)=>{
      this.InventryArr=res;
    })
    this.productServ.GetBrandData().subscribe((res)=>{
      this.BrandArr=res;
    })
    this.productServ.GetChildCategory().subscribe((res)=>{
      this.CategoryArr=res;
    })
    this.isLoading=false;
  }
  onImageClick(imageUrl:string){
    this.CurrentPreviewImage=imageUrl;
  }
  acceptProduct(){
    this.ReviewProductEntity.requestStatus=true;
    this.submitChanges();
  }
  rejectProduct(){
    this.ReviewProductEntity.requestStatus=false;
    this.submitChanges();
  }
  submitChanges(){
    this.isLoading=true
    this.reviewProductServ.UpdateReviewedProduct(this.RequestId,this.ReviewProductEntity).subscribe((res)=>{
      this.isLoading=false
      this.router.navigate(['/product/review-products']);
    });
  }
}
