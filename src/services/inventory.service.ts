import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl=environment.apiUrl;
  constructor(private httpClient : HttpClient) { }

  getAll():Observable<Inventory[]>{
    return this.httpClient.get<Inventory[]>(this.apiUrl + '/Inventory');
  }
  
  getById(id:number):Observable<Inventory>{
    return this.httpClient.get<Inventory>(this.apiUrl + '/Inventory/' + id);
  }

  add(inventory: Inventory):Observable<Inventory>{
    return this.httpClient.post<Inventory>(this.apiUrl + '/Inventory/add', inventory);
  }
  update(inventory: Inventory, id: number):Observable<Inventory>{
    return this.httpClient.put<Inventory>(this.apiUrl + '/Inventory/update/' +id, inventory);
  }
  
  delete(id: number):Observable<Inventory>{
    return this.httpClient.delete<Inventory>(this.apiUrl + '/Inventory/delete/' + id);
  }

  isInventoryHasProducts(inventoryId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}/Inventory/IsInventoryHasProducts/${inventoryId}`);
  }

}
