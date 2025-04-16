import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private httpClient : HttpClient) { }
  private apiUrl=environment.apiUrl;
  GetAll():Observable<Category[]>{
    return this.httpClient.get<Category[]>(this.apiUrl + '/Category');
  }
  GetById(id:number):Observable<Category>{
    return this.httpClient.get<Category>(this.apiUrl + '/Category/'+id);
  }
  DeleteParentCategory(id:number):Observable<any>{
    return this.httpClient.delete(this.apiUrl + '/Category/'+id);
  }
  DeleteChildCategory(id:number):Observable<any>{
    return this.httpClient.delete(this.apiUrl + '/Category/DeleteChildCategory/'+id);
  }
  AddCategory(categoryForm:FormData):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/Category`, categoryForm);
  }
  UpdateCategory(categoryForm:FormData):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/Category/UpdateCategory`, categoryForm);
  }
}
