import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';
import { DiscountService } from '../../../../services/discount.service';
import { ReadDiscountDetailsDTO } from '../../../../models/read-discount-details-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
declare var bootstrap: any;
@Component({
  selector: 'app-manage-discounts',
  imports: [SpinnerComponent, CommonModule, FormsModule],
  templateUrl: './manage-discounts.component.html',
  styleUrl: './manage-discounts.component.scss',
})
export class ManageDiscountsComponent implements OnInit {
  isLoading: boolean = false;
  DiscountArr!: ReadDiscountDetailsDTO[];
  selectedProductId!: number;
  private startDateSubject = new BehaviorSubject<Date>(new Date());
  private endDateSubject = new BehaviorSubject<Date>(new Date());
  startDate$ = this.startDateSubject.asObservable();
  endDate$ = this.endDateSubject.asObservable();
  CurrentPage:number=1;
  TotalPages!:number;
  constructor(private discountServ: DiscountService, private router: Router) {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const endDate = endOfMonth.toLocaleDateString('en-CA');
    this.startDateSubject.next(new Date(startDate));
    this.endDateSubject.next(new Date(endDate));
  }
  updateStartDate(dateString: string) {
    const parsedDate = new Date(dateString);
    this.startDateSubject.next(parsedDate);
  }
  updateEndDate(dateString: string) {
    const parsedDate = new Date(dateString);
    this.endDateSubject.next(parsedDate);
  }
  ngOnInit() {
    this.isLoading=true
    combineLatest([this.startDate$,this.endDate$]).subscribe(([startDate,endDate])=>{
      this.discountServ.GetDiscountsBetweenDates(startDate,endDate).subscribe({
        next:(res)=>{
          this.DiscountArr=res;
          this.TotalPages = Math.ceil(res.length / 10);
          this.isLoading=false;
        },
        error:()=>{
          console.log('Failed');
          this.isLoading=false;
        }
      })
    })
  }
  NavigateToDetails(id: number) {
    this.router.navigate([`/product/discount-details/${id}`]);
  }
  openDeleteModal(productId: number) {
    this.selectedProductId = productId;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
  confirmDelete() {
    const modalElement = document.getElementById('deleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    this.isLoading = true;
    this.discountServ
      .DeleteDiscount(this.selectedProductId)
      .subscribe((res) => {
        this.discountServ.GetDiscounts().subscribe((respond) => {
          this.DiscountArr = respond;
          this.isLoading = false;
        });
      });
  }
  get PaginatedData(){
    const start = (this.CurrentPage - 1 ) * 10;
    const end = this.CurrentPage * 10
    return this.DiscountArr.slice(start,end);
  }
  prevPage(){
    this.CurrentPage--;
  }
  nextPage(){
    this.CurrentPage++;
  }
}
