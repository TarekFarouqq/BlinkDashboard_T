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
  constructor(private discountServ: DiscountService, private router: Router) {
    this.startDateSubject.next(new Date());
    this.endDateSubject.next(new Date());
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
    this.discountServ.GetDiscounts().subscribe((res) => {
      this.DiscountArr = res;
    });
    this.startDate$.subscribe((res) => {
      this.filterByDate();
    });
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
  filterByDate() {
    combineLatest([this.startDate$, this.endDate$]).subscribe(([StartDate, EndDate]) => {
      this.discountServ.GetDiscounts().subscribe((res) => {
        this.DiscountArr = res.filter((discount) => {
          return (
            new Date(discount.discountFromDate) >= StartDate &&
            new Date(discount.discountEndDate) <= EndDate
          );
        });
      });
    });
  }
}
