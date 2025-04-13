import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Brand } from '../../../../models/brand';
import { BrandService } from '../../../../services/brand.service';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './update.component.html',
  styleUrl: './update.component.scss',
})
export class UpdateComponent implements OnInit {
  updateBrandForm!: FormGroup;
  brand!: Brand;
  brandId!: number;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  constructor(
    private brandService: BrandService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.updateBrandForm = new FormGroup({
      brandName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      websiteUrl: new FormControl('', [
        Validators.required,
        Validators.pattern('https?://.+'),
      ]),
      brandImageFile: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.brandId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.brandService.getBrandById(this.brandId).subscribe({
      next: (response) => {
        this.brand = response;
        this.updateBrandForm.patchValue({
          brandName: this.brand.brandName,
          description: this.brand.brandDescription,
          websiteUrl: this.brand.brandWebSiteURL,
        });
        this.imagePreview = this.brand.brandImage;
      },
      error: (error) => {
        console.error('Error fetching brand:', error);
      },
    });
  }
  onSubmit(): void {
    this.updateBrand();
  }
  updateBrand(): void {
    if (this.updateBrandForm.valid) {
      const formData = new FormData();
      formData.append('BrandName',this.updateBrandForm.get('brandName')?.value);
      formData.append('BrandDescription',this.updateBrandForm.get('description')?.value);
      formData.append('BrandWebSiteURL',this.updateBrandForm.get('websiteUrl')?.value);
      formData.append('BrandImageFile', this.selectedFile!);
      this.brandService.updateBrand(this.brandId, formData).subscribe({
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
        this.updateBrandForm.get('brandImageFile')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }
  goToManage() {
    this.router.navigate(['/Brand/manage']);
  }
  get brandName() {
    return this.updateBrandForm.get('brandName');
  }
  get description() {
    return this.updateBrandForm.get('description');
  }
  get websiteUrl() {
    return this.updateBrandForm.get('websiteUrl');
  }
  get imageUrl() {
    return this.updateBrandForm.get('imageUrl');
  }
}
