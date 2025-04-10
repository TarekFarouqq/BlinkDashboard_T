import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Brand } from 'src/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ ReactiveFormsModule],

  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
 
  
})
export class UpdateComponent implements OnInit {
  updateBrandForm!: FormGroup;
  brand!: Brand;
  brandId!: number;
   
  constructor(private brandService: BrandService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.updateBrandForm = new FormGroup({
      brandName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      websiteUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
      imageUrl: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.brandId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.brandService.getBrandById(this.brandId).subscribe({
      next: (response) => {
        this.brand = response;
        this.updateBrandForm.patchValue(this.brand);
      },
      error: (error) => {
        console.error('Error fetching brand:', error);
      }
    });
  }

  onSubmit(): void {
    this.updateBrand();
  }

  updateBrand(): void {
    if (this.updateBrandForm.valid) {
      this.brandService.updateBrand(this.brandId, this.updateBrandForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Brand updated successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.updateBrandForm.reset();
        },
        error: (error) => {
          console.error('Error updating brand:', error);
        }
      });
    }}
    goToManage() {
      this.router.navigate(['/Brand/manage']);
    }
    get brandName() { return this.updateBrandForm.get('brandName'); }
    get description() { return this.updateBrandForm.get('description'); }
    get websiteUrl() { return this.updateBrandForm.get('websiteUrl'); }
    get imageUrl() { return this.updateBrandForm.get('imageUrl'); }
  
}
