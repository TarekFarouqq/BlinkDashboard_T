import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {
  constructor(private httpClient : HttpClient) { }
  private apiUrl=environment.apiUrl;
  GetTransactionHistory():Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl + '/ProductTransfer'); 
  }
  GetTransactionHistoryById(id:number):Observable<any>{
    return this.httpClient.get<any[]>(`${this.apiUrl}/ProductTransfer/${id}`); 
  }
  CreateTransaction(formGroup:any):Observable<any>{
    return this.httpClient.post(`${this.apiUrl}/ProductTransfer/CreateTransaction`,formGroup); 
  }
  UpdateTransaction(id:number,formGroup:any):Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/ProductTransfer/UpdateTransaction/${id}`,formGroup); 
  }
  GetTotalPages(pgSize:number):Observable<number>{
    return this.httpClient.get<number>(`${this.apiUrl}/ProductTransfer/GetTotalPages/${pgSize}`); 
  }
  GetDataWithPagination(pgNumber:number,pgSize:number):Observable<any[]>{
    return this.httpClient.get<any[]>(`${this.apiUrl}/ProductTransfer/GetDataWithPaginated/${pgNumber}/${pgSize}`); 
  }
}
