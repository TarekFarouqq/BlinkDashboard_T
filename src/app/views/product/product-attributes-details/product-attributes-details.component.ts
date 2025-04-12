import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadFilterAttributes } from '../../../../models/read-filter-attributes';
import { FormBuilder, FormGroup, FormArray, FormControl, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-attributes-details',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './product-attributes-details.component.html',
  styleUrl: './product-attributes-details.component.scss',
})
export class ProductAttributesDetailsComponent implements OnInit {
  ProductId!: number;
  ProductEntity!: Product;
  FilterAttributesArr!: ReadFilterAttributes[];
  ProductAttributesGroup:FormGroup;
  constructor(
    private productServ: ProductService,
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private router:Router
  ) {
    this.route.paramMap.subscribe((params) => {
      this.ProductId = Number(params.get('id'));
    });
    this.ProductAttributesGroup = this.fb.group({
      productAttributes: this.fb.array([
        this.createAttributeGroup()
      ])
    });
  }
  createAttributeGroup(): FormGroup {
    return this.fb.group({
      productId: [this.ProductId],
      attributeId: ['', Validators.required],
      attributeValue: ['', Validators.required],
      hasDefaultAttributes: [false],
      defaultValues: [[]]
    });
  }
  ngOnInit() {
    this.productServ.GetById(this.ProductId).subscribe((res) => {
      this.ProductEntity = res;
      this.productServ.GetFilterAttributes().subscribe((res) => {
        this.FilterAttributesArr = res;
        this.productServ.GetProductAttributes(this.ProductId).subscribe((res)=>{
          const attrFormArray=this.ProductAttributes;
          attrFormArray.clear();
          res.forEach((attr:any)=>{
            const relatedAttr = this.FilterAttributesArr.find(fp => fp.attributeId == attr.attributeId);

          const formGroup = this.fb.group({
            productId: [attr.productId],
            attributeId: [attr.attributeId, Validators.required],
            attributeValue: [attr.attributeValue, Validators.required],
            hasDefaultAttributes: [relatedAttr?.hasDefaultAttributes || false],
            defaultValues: [relatedAttr?.defaultAttributes || []]
          });
          attrFormArray.push(formGroup);
          })
        })
      });
    });
  }
  get ProductAttributes(): FormArray {
    return this.ProductAttributesGroup.get('productAttributes') as FormArray;
  }
  addAttribute() {
    this.ProductAttributes.push(this.createAttributeGroup());
  }
  removeAttribute(index: number) {
    this.ProductAttributes.removeAt(index);
  }
  onSubmit() {
    const formArray = this.ProductAttributes.value as Array<any>;
    const formData = new FormData();
    formArray.forEach((attr, index) => {
      formData.append(`attributes[${index}].productId`, attr.productId);
      formData.append(`attributes[${index}].attributeId`, attr.attributeId);
      formData.append(`attributes[${index}].attributeValue`, attr.attributeValue);
    });
    this.productServ.AddProductAttribute(this.ProductId, formData).subscribe((res)=>{
      this.router.navigate(['/product/product-attributes'])
    })
  }
  changeAttribute(attr: AbstractControl) {
    if (attr instanceof FormGroup) {
      const attributeId = attr.get('attributeId')?.value;
      const attribute = this.FilterAttributesArr.find(fp => fp.attributeId == attributeId);
  
      if (attribute?.hasDefaultAttributes) {
        attr.get('hasDefaultAttributes')?.setValue(true);
        attr.get('defaultValues')?.setValue(attribute.defaultAttributes || []);
      } else {
        attr.get('hasDefaultAttributes')?.setValue(false);
        attr.get('defaultValues')?.setValue([]);
      }
      attr.get('attributeValue')?.reset();
    }
  }
  getInputType(attr: AbstractControl): string {
    let dataType = '';
  
    if (attr instanceof FormGroup) {
      const attributeId = attr.get('attributeId')?.value;
      if (!attributeId || !this.FilterAttributesArr) return dataType;
  
      const attribute = this.FilterAttributesArr.find(fp => fp.attributeId == attributeId);
      if (attribute) {
        switch (attribute.attributeType?.toLowerCase()) {
          case 'int':
            dataType = 'number';
            break;
          case 'string':
            dataType = 'text';
            break;
          case 'date':
            dataType = 'date';
            break;
          default:
            dataType = 'text';
            break;
        }
      }
    }
  
    return dataType;
  }
}
