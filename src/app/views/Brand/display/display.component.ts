import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '../../../../models/brand';
import { BrandService } from 'src/services/BranchServices/brand.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  brandId: number = 0;
  brand: Brand | undefined;

  constructor(private route: ActivatedRoute, private brandService: BrandService, private router: Router) { }

  ngOnInit(): void {
     
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.brandId = +id;
      this.loadBrandDetails();
    } else {
      console.error('Brand ID is missing from the route');
    }
  }

  loadBrandDetails(): void {
    this.brandService.getBrandById(this.brandId).subscribe({
      next: (data) => {
        this.brand = data;
      },
      error: (err) => {
        console.error('Error fetching brand details:', err);
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/Brand/manage']);
  }
}
