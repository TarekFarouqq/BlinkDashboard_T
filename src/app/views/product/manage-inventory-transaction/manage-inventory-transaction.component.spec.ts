import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInventoryTransactionComponent } from './manage-inventory-transaction.component';

describe('ManageInventoryTransactionComponent', () => {
  let component: ManageInventoryTransactionComponent;
  let fixture: ComponentFixture<ManageInventoryTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageInventoryTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInventoryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
