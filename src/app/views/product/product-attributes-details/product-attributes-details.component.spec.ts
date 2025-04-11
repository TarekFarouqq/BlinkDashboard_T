import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributesDetailsComponent } from './product-attributes-details.component';

describe('ProductAttributesDetailsComponent', () => {
  let component: ProductAttributesDetailsComponent;
  let fixture: ComponentFixture<ProductAttributesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAttributesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAttributesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
