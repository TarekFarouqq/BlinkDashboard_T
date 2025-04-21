import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/services/auth.service';
import { SupplierserviceService } from 'src/services/supplierservice.service';

@Component({
  selector: 'app-supplier',
  imports: [],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent implements OnInit {

  supplierReportUrl: SafeResourceUrl | null = null;
  userRole: string | null = null;
  isLogged: boolean = false;
  supplierId: string | null = null; 
  constructor( private biService: SupplierserviceService, 
    private sanitizer: DomSanitizer, private authServ: AuthService) {
    this.authServ.isLoggedIn$.subscribe((res) => {
      this.isLogged = res;
      this.authServ.userRole$.subscribe((res) => {
        this.userRole = res;
      });
    });
  }


  
  ngOnInit(): void {
      if (this.isLogged) {
      this.supplierId = this.authServ.getUserId()
      if (this.userRole == 'Supplier') {
        const reportUrl = `https://app.powerbi.com/reportEmbed?reportId=c8452a82-520d-454c-8b42-154abf18834f&autoAuth=true&ctid=df8679cd-a80e-45d8-99ac-c83ed7ff95a0&filter=Product_Dimension/Supplier_ID eq 'a19c5d14'`;

    // Sanitize and assign
    this.supplierReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reportUrl);
    
      }


    }
    
  }
}
