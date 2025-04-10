import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormGroup, FormControl, Validators, } from '@angular/forms';
import { BrandService } from '../../../services/brand.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-add-brand',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './add-brand.component.html',
  styleUrl: './add-brand.component.scss'
})
export class AddBrandComponent implements OnInit {
  addBrandForm: FormGroup;

  constructor(private brandService: BrandService) {
    this.addBrandForm = new FormGroup({
      brandName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      brandDescription: new FormControl('', [Validators.required]), 
      brandWebSiteURL: new FormControl('', [Validators.required]), 
      brandImage: new FormControl('', [Validators.required]), 
    });
  }

  ngOnInit(): void {}
  onSubmit(): void {
    this.addBrand();
  }

  addBrand(): void {
    if (this.addBrandForm.valid) {
      this.brandService.aaddBrand(this.addBrandForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Brand added successfully',
            showConfirmButton: false,
            timer: 2500,
          });
          this.addBrandForm.reset();
        },
        error: (error) => {
          console.error('Error adding brand:', error);
        }
      });
    }
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addBrandForm.patchValue({ brandImage: file });
    }
  }
  
  // Getter methods
  get brandName() { return this.addBrandForm.get('brandName'); }
  get brandDescription() { return this.addBrandForm.get('brandDescription'); }
  get brandWebSiteURL() { return this.addBrandForm.get('brandWebSiteURL'); }
  get brandImage() { return this.addBrandForm.get('brandImage'); }
}
