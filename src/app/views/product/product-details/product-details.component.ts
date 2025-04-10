import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerComponent } from '@coreui/angular';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  FormControlDirective,
  FormDirective,
  FormLabelDirective,
} from '@coreui/angular';
@Component({
  selector: 'app-product-details',
  imports: [SpinnerComponent,ReactiveFormsModule,FormsModule,ButtonDirective,FormControlDirective,FormDirective,FormLabelDirective],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  isLoading:boolean=true;
  ProductId!:number;
  ProductEntity!:Product;
  constructor(private route: ActivatedRoute,private productServ:ProductService) {
    this.route.paramMap.subscribe((params) => {
      this.ProductId = Number(params.get('id'));
    });
  }
  ngOnInit() {
    if(this.ProductId > 0 ){
      this.productServ.GetById(this.ProductId).subscribe((res) => {
        this.ProductEntity=res;
        this.isLoading=false;
    },
    (err)=>{
      this.isLoading=false;
    });
    }else{
      this.isLoading=false;
    }
  }
  addImage() {
    const imgContainer = document.getElementById('image-container') as HTMLDivElement;
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('flex-column', 'col-md-6', 'mb-3');
    imgDiv.innerHTML = `
      <input cFormControl id="inp-ProductImage" type="file" accept="image/*">
    `;
    imgContainer.appendChild(imgDiv);
  }
}
