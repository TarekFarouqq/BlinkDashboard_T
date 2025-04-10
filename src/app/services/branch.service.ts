import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private _HttpClient:HttpClient) { }

  getAllBranches():Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Branch`);
  }

  getBranchById(id:string):Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Branch/${id}`);
  }
  addBranch(data:any):Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Branch/add`, data);
  }
  updateBranch(id:string, data:any):Observable<any> {
    return this._HttpClient.put(`${environment.apiUrl}/Branch/update/${id}`, data);
  }

  deleteBranch(id:string):Observable<any> {
    return this._HttpClient.delete(`${environment.apiUrl}/Branch/delete/${id}`);
  }
}
