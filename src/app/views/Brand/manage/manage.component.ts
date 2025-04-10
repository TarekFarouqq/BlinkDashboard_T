import { Component, NgModule, OnInit } from '@angular/core';
import { Brand } from '../../../../models/brand';  
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { BrandService } from 'src/services/BranchServices/brand.service';

 

@Component({
  selector: 'app-manage',
  imports: [CommonModule,FormsModule,CommonModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
 
export class ManageComponent implements OnInit {

  brands: Brand[] = [];  
  search: string = '';
  isLoading: boolean = true;
  constructor(private brandService: BrandService, private router: Router) {}

  ngOnInit(): void {
    this.loadBrands();
  }
  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.brands = res;
        this.isLoading= false;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
      }
    });
}

// filter brand:
filterBrands(): Brand[] {
  return this.brands.filter(brand => 
    brand.BrandName.toLowerCase().includes(this.search.toLowerCase())
  );


}
goToBrandDisplay(brandId: number): void {
  this.router.navigate(['/Brand/display', brandId]);
}

}
   

