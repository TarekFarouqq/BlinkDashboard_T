import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewProductDetailsComponent } from './review-product-details.component';

describe('ReviewProductDetailsComponent', () => {
  let component: ReviewProductDetailsComponent;
  let fixture: ComponentFixture<ReviewProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewProductDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
