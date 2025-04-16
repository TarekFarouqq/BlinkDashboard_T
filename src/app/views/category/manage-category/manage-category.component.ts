import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
import { SpinnerComponent } from '@coreui/angular';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare var bootstrap: any;
@Component({
  selector: 'app-manage-category',
  imports: [CommonModule, FormsModule, SpinnerComponent],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss',
})
export class ManageCategoryComponent implements OnInit {
  CurrentPage: number = 1;
  MaxPages: number = 1;
  MobileWidth: boolean = false;
  CategoryArr!: Category[];
  isLoading: boolean = true;
  selectedProductId: number = 0;
  @HostListener('window:resize', [])
  onWindowResize() {
    this.checkScreenSize();
  }
  constructor(private categoryServ: CategoryService,private router:Router) {}
  ngOnInit() {
    this.isLoading = true;
    this.checkScreenSize();
    this.GetCategoryData();
    this.isLoading = false;
  }
  private checkScreenSize() {
    this.MobileWidth = window.innerWidth <= 540;
  }
  GetCategoryData(){
    this.categoryServ.GetAll().subscribe((res)=>{
      this.CategoryArr=res;
    })
  }
  NextPage() {
    this.CurrentPage += 1;
  }
  PrevPage() {
    this.CurrentPage -= 1;
  }
  openDeleteModal(id: number) {
    this.selectedProductId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
  ConfirmDelete() {
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    this.isLoading = true;
    this.categoryServ
      .DeleteParentCategory(this.selectedProductId)
      .subscribe((res) => {
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'success',
          title: 'Category Deleted Successfully',
          showConfirmButton: false,
          timer: 2500,
        });
        this.GetCategoryData();
        this.isLoading=false;
      },(error)=>{
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'error',
          title: error.error.message,
          showConfirmButton: false,
          timer: 2500,
        });
        this.GetCategoryData();
        this.isLoading=false;
      });
  }
  NavigateToDetails(id:number){
    this.router.navigate(['category/details',id])
  }
}
