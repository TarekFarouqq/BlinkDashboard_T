import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchesInventoriesComponent } from './branches-inventories.component';

describe('BranchesInventoriesComponent', () => {
  let component: BranchesInventoriesComponent;
  let fixture: ComponentFixture<BranchesInventoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchesInventoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchesInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
