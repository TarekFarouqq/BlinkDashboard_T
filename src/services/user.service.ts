import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { User } from '../models/User';  
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AddUser } from '../models/add-user';
import { AddAdmin } from '../models/add-admin';
 
 

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  constructor(private httpClient: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/Users/GetAll`);
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/Users/GetById/${id}`);     

    
  }

  getUserByName(name: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/Users/GetByUserName/${name}`);
  }

  addUser(user: AddUser): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Users/Insert`, user);
  }

  updateUser(id: string, user: User): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/Users/Update/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/Users/Delete/${id}`);
  }

// user pagination : 
getPaginatedUsers(pageNumber: number, pageSize: number): Observable<User[]> {
  return this.httpClient.get<User[]>(`${this.apiUrl}/Users/GetAllPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

getPagesCount(pageSize: number): Observable<number> {
  return this.httpClient.get<number>(`${this.apiUrl}/Users/GetPagesCount?pageSize=${pageSize}`);
}

// add admin :
addAdmin(admin: AddAdmin): Observable<any> {
  return this.httpClient.post(`${this.apiUrl}/Account/RegisterAdmin`, admin);
}
 // add client 
// addClient(client: AddUser): Observable<any> {
//   return this.httpClient.post(`${this.apiUrl}/Users/Insert`, client);
// }
// // add supplier :
// addSupplier(supplier: AddUser): Observable<any> {
//   return this.httpClient.post(`${this.apiUrl}/Users/Insert`, supplier);
// }
 

}
