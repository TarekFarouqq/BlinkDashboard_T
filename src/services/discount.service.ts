import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadDiscountDetailsDTO } from '../models/read-discount-details-dto';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  constructor(private httpClient : HttpClient) { }
  private apiUrl=environment.apiUrl;
  GetDiscounts():Observable<ReadDiscountDetailsDTO[]>{
    return this.httpClient.get<ReadDiscountDetailsDTO[]>(`${this.apiUrl}/Discount/GetDiscounts`); 
  }
  GetDiscountById(id:number):Observable<ReadDiscountDetailsDTO>{
    return this.httpClient.get<ReadDiscountDetailsDTO>(`${this.apiUrl}/Discount/GetDiscountById/${id}`); 
  }
  CreateDiscount(formData:any):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/Discount`,formData);
  }
  UpdateDiscount(formData:any):Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/Discount`,formData);
  }
  DeleteDiscount(id:number):Observable<any>{
    return this.httpClient.delete<any>(`${this.apiUrl}/Discount/${id}`); 
  }
}
