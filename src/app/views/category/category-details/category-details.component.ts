import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../services/category.service'; // Adjust the path as needed
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '@coreui/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss',
})
export class CategoryDetailsComponent implements OnInit {
  CategoryForm: FormGroup;
  CategoryId!: number;
  isLoading: boolean = true;
  constructor(
    private fb: FormBuilder,
    private routes: ActivatedRoute,
    private categoryServ: CategoryService,
    private router: Router
  ) {
    this.routes.paramMap.subscribe((value) => {
      this.CategoryId = Number(value.get('id'));
    });
    this.CategoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      categoryDescription: ['', Validators.required],
      categoryImage: [null, Validators.required],
      previewUrl: ['', Validators.required],
      subCategories: this.fb.array([]),
    });
  }
  ngOnInit() {
    if (this.CategoryId > 0) {
      this.categoryServ.GetById(this.CategoryId).subscribe((res) => {
        this.CategoryForm.patchValue({
          categoryName: res.categoryName,
          categoryDescription: res.categoryDescription,
          categoryImage: res.categoryImage,
          previewUrl: res.categoryImage,
        });
        res.subCategories.forEach((subCategory: any) => {
          this.AddExistingSubCategory(subCategory);
        });
      });
    }
    this.isLoading = false;
  }
  get subCategories(): FormArray {
    return this.CategoryForm.get('subCategories') as FormArray;
  }
  AddSubCategory() {
    this.subCategories.push(
      this.fb.group({
        categoryName: ['', Validators.required],
        categoryDescription: ['', Validators.required],
        categoryImage: [null, Validators.required],
        previewUrl: ['', Validators.required],
      })
    );
  }
  AddExistingSubCategory(subCategory: any) {
    const subCategoryGroup = this.fb.group({
      categoryId: [subCategory.categoryId],
      categoryName: [subCategory.categoryName, Validators.required],
      categoryDescription: [
        subCategory.categoryDescription,
        Validators.required,
      ],
      categoryImage: [subCategory.categoryImage, Validators.required],
      previewUrl: [subCategory.categoryImage, Validators.required],
    });
    this.subCategories.push(subCategoryGroup);
  }
  onFileChanged(event: any) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.CategoryForm.patchValue({
        categoryImage: file,
        previewUrl: imageUrl,
      });
    }
  }
  onFileChangedSubCategory(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.subCategories.at(index).patchValue({
        categoryImage: file,
        previewUrl: imageUrl,
      });
    }
  }
  DeleteSubCategory(index: number) {
    const control = this.subCategories.at(index).get('categoryId');
    let subCategoryId = this.subCategories
      .at(index)
      .get('categoryId')
      ?.getRawValue();
    if (this.CategoryId > 0) {
      if (subCategoryId > 0) {
        this.categoryServ.DeleteChildCategory(subCategoryId).subscribe(
          (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Operation Completed',
              text: res.message,
            });
            this.subCategories.removeAt(index);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: "Can't Delete Category",
              text: error.error.message,
            });
            this.isLoading = false;
          }
        );
      } else {
        this.subCategories.removeAt(index);
      }
    } else {
      this.subCategories.removeAt(index);
    }
  }
  onSubmit() {
    this.isLoading = true;

    if (this.CategoryId === 0) {
      const formData = new FormData();
      formData.append('CategoryName', this.CategoryForm.value.categoryName);
      formData.append(
        'CategoryDescription',
        this.CategoryForm.value.categoryDescription
      );
      const mainImage = this.CategoryForm.value.categoryImage;
      if (mainImage instanceof File) {
        formData.append('CategoryImage', mainImage);
      }
      this.subCategories.controls.forEach((subCat, index) => {
        const sub = subCat.value;
        formData.append(
          `SubCategories[${index}].CategoryName`,
          sub.categoryName
        );
        formData.append(
          `SubCategories[${index}].CategoryDescription`,
          sub.categoryDescription
        );
        const subImage = sub.categoryImage;
        if (subImage instanceof File) {
          formData.append(`SubCategories[${index}].CategoryImage`, subImage);
        }
      });
      this.categoryServ.AddCategory(formData).subscribe(
        (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Category Added Successfully',
            showConfirmButton: false,
            timer: 1500,
          });
          this.CategoryForm.reset();
          this.isLoading = false;
          this.router.navigate(['/category']);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: "Can't Add Category",
            text: error.error.message,
          });
          this.isLoading = false;
        }
      );
    } else {
       // ✅ تعديل البيانات الموجودة
    const formUpdate = new FormData();
    formUpdate.append('CategoryId', this.CategoryId.toString());
    formUpdate.append('CategoryName', this.CategoryForm.value.categoryName);
    formUpdate.append('CategoryDescription', this.CategoryForm.value.categoryDescription);

    const mainImage = this.CategoryForm.value.categoryImage;
    if (mainImage instanceof File) {
      formUpdate.append('NewImage', mainImage);
      formUpdate.append('OldImage', '');
    } else {
      formUpdate.append('NewImage', new Blob());
      formUpdate.append('OldImage', this.CategoryForm.value.previewUrl);
    }

    this.subCategories.controls.forEach((subCat, index) => {
      const sub = subCat.value;
      formUpdate.append(`SubCategories[${index}].CategoryId`, sub.categoryId?.toString() || '0');
      formUpdate.append(`SubCategories[${index}].CategoryName`, sub.categoryName);
      formUpdate.append(`SubCategories[${index}].CategoryDescription`, sub.categoryDescription);

      if (sub.categoryImage instanceof File) {
        formUpdate.append(`SubCategories[${index}].NewImage`, sub.categoryImage);
        formUpdate.append(`SubCategories[${index}].OldImage`, '');
      } else {
        formUpdate.append(`SubCategories[${index}].NewImage`, new Blob());
        formUpdate.append(`SubCategories[${index}].OldImage`, sub.previewUrl || '');
      }
    });

    formUpdate.forEach((val, key) => console.log(`${key}:`, val));

    this.categoryServ.UpdateCategory(formUpdate).subscribe(
      (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Category Updated Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        this.isLoading = false;
        this.router.navigate(['/category']);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: "Can't Update Category",
          text: error.error.message,
        });
        this.isLoading = false;
      }
    );
    }
  }
}

