import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-attributes-details',
  imports: [],
  templateUrl: './product-attributes-details.component.html',
  styleUrl: './product-attributes-details.component.scss'
})
export class ProductAttributesDetailsComponent implements OnInit{
  ProductId!:number;
  ProductEntity!:Product;
  constructor(private productServ:ProductService,private route:ActivatedRoute){
    this.route.paramMap.subscribe((params) => {
      this.ProductId = Number(params.get('id'));
    });
  }
  ngOnInit(){
    this.productServ.GetById(this.ProductId).subscribe((res)=>{
      this.ProductEntity=res;
    })
  }
}
