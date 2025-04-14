import { TestBed } from '@angular/core/testing';

import { ReviewProductsService } from './review-products.service';

describe('ReviewProductsService', () => {
  let service: ReviewProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
