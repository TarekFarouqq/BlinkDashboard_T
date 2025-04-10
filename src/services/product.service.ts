import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { InsertProductDTO } from '../models/insert-product-dto';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient : HttpClient) { }
  private apiUrl=environment.apiUrl;
  GetAll():Observable<Product[]>{
    return this.httpClient.get<Product[]>(this.apiUrl + '/product');
  }
  GetById(id:number):Observable<Product>{
    return this.httpClient.get<Product>(this.apiUrl + '/product/' + id);
  }
  GetTotalPages(pgSize:number):Observable<number>{
    return this.httpClient.get<number>(this.apiUrl + '/product/GetPagesCount/' + pgSize);
  }
  GetPagginatedProducts(pgNumber:number,pgSize:number):Observable<Product[]>{
    return this.httpClient.get<Product[]>(this.apiUrl + '/product/GetAllWithPaging/' + pgNumber + '/' + pgSize);
  }
  GetFilteredProducts(filter:string,pgNumber:number,pgSize:number):Observable<Product[]>{
    return this.httpClient.get<Product[]>(this.apiUrl + '/product/GetFilteredProducts/' + filter + '/' + pgNumber + '/' + pgSize);
  }
  InsertProduct(product:FormData):Observable<any>{
    return this.httpClient.post(this.apiUrl + '/product',product);
  }
  UpdateProduct(id:number, product:FormData):Observable<any>{
    return this.httpClient.put(this.apiUrl + `/product/${id}`,product);
  }
  DeleteProduct(id:number):Observable<any>{
    return this.httpClient.delete(this.apiUrl + '/product/' + id);
  }
}
