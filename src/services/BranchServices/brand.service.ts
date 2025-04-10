import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
 
import { Brand } from '../../models/brand';  
 


@Injectable({
  providedIn: 'root'
})
export class BrandService {
  constructor(private httpClient: HttpClient) { }

  private apiUrl = environment.apiUrl;

  // Get all brands
  getAllBrands(): Observable<any> {
    return this.httpClient.get<Brand[]>(`${this.apiUrl}/Brand/GetAllBrands`);
  }
// get by id :
getBrandById(id: number) {
  return this.httpClient.get<Brand>(`${this.apiUrl}/Brand/${id}`);  
}
  // add new brand :
  aaddBrand(brand: Brand): Observable<any> {
    return this.httpClient.post<Brand>(`${this.apiUrl}/Brand/InsertBrand`, brand);
  }

  // update brand by id:
  updateBrand(id: number, brand: Brand): Observable<any> {
    return this.httpClient.put<Brand>(`${this.apiUrl}/Brand/UpdateBrand/${brand.id}`, brand);
  }
  // delete brand by id:
  deleteBrand(id: number): Observable<any> {
    return this.httpClient.delete<Brand>(`${this.apiUrl}/Brand/SoftDeleteBrand/${id}`);
  } 
 
}
