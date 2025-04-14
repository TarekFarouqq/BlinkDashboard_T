import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewSuppliedProducts } from '../models/review-supplied-products';

@Injectable({
  providedIn: 'root'
})
export class ReviewProductsService {
  private apiUrl=environment.apiUrl;
  constructor(private httpClient:HttpClient) { }
  GetReviewProductsByRequestId(id:number):Observable<ReviewSuppliedProducts>{
    return this.httpClient.get<ReviewSuppliedProducts>(`${this.apiUrl}/product/GetSuppliedProductByRequestId/${id}`);
  }
  UpdateReviewedProduct(id:number, model:ReviewSuppliedProducts):Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/product/UpdateRequestSuppliedProduct/${id}`,model);
  }
}
