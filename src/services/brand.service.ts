import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Observable } from 'rxjs';

import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  constructor(private httpClient: HttpClient) {}

  private apiUrl = environment.apiUrl;
  getAllBrands(): Observable<any> {
    return this.httpClient.get<Brand[]>(`${this.apiUrl}/Brand`);
  }
  getBrandById(id: number) {
    return this.httpClient.get<Brand>(`${this.apiUrl}/Brand/${id}`);
  }
  getBrandByName(name: string): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(`${this.apiUrl}/Brand/GetBrandByName/${name}`);
  }
  // aaddBrand(brand: Brand): Observable<any> {
  //   return this.httpClient.post<Brand>(`${this.apiUrl}/Brand`,brand);
  // }
  aaddBrand(brandData: FormData): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Brand`, brandData);
  }
  // updateBrand(id: number, brand: Brand): Observable<any> {
  //   return this.httpClient.put<Brand>(`${this.apiUrl}/Brand/${brand.brandId}`,brand);
  // }
  updateBrand(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/Brand/${id}`, formData);
  }
  deleteBrand(id: number): Observable<any> {
    return this.httpClient.delete<Brand>(`${this.apiUrl}/Brand/${id}`);
  }

  // brand pagination : 
  getPaginatedBrands(pageNumber: number, pageSize: number): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(`${this.apiUrl}/Brand/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  
  getBrandsPagesCount(pageSize: number): Observable<number> {
    return this.httpClient.get<number>(`${this.apiUrl}/Brand/pages-count?pageSize=${pageSize}`);
  }
  
}
