import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierserviceService {

  isLogged = false;
  userRole : string | null = '';
  constructor(private authServ: AuthService) { 
    this.authServ.isLoggedIn$.subscribe((res) => {
      this.isLogged = res
      this.authServ.userRole$.subscribe((res) => {
        this.userRole = res
      })
    })
  }
    

  getSupplierId(): string {
    if (this.isLogged && this.userRole == 'supplier') {
      const supplierId = localStorage.getItem('supplierId');
      if (supplierId) {
        return supplierId;
      }
    }
    return ''; // Return an empty string if conditions are not met
  }






}

 
