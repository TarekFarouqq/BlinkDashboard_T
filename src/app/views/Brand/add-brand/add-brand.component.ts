import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../../../services/brand.service';

@Component({
  selector: 'app-add-brand',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-brand.component.html',
  styleUrl: './add-brand.component.scss',
})
export class AddBrandComponent implements OnInit {
  addBrandForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  constructor(private brandService: BrandService) {
    this.addBrandForm = new FormGroup({
      brandName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      brandDescription: new FormControl('', [Validators.required]),
      brandWebSiteURL: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {}
  onSubmit(): void {
    this.addBrand();
  }
  addBrand(): void {
    if (this.addBrandForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('BrandName', this.addBrandForm.get('brandName')?.value);
      formData.append(
        'BrandDescription',
        this.addBrandForm.get('brandDescription')?.value
      );
      formData.append(
        'BrandWebSiteURL',
        this.addBrandForm.get('brandWebSiteURL')?.value
      );
      formData.append('BrandImageFile', this.selectedFile); 

      this.brandService.aaddBrand(formData).subscribe({
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
          this.imagePreview = null;
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error adding brand:', error);
        },
      });
    }
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  get brandName() {
    return this.addBrandForm.get('brandName');
  }
  get brandDescription() {
    return this.addBrandForm.get('brandDescription');
  }
  get brandWebSiteURL() {
    return this.addBrandForm.get('brandWebSiteURL');
  }
  get brandImage() {
    return this.addBrandForm.get('brandImage');
  }
}
