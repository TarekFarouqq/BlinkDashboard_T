import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { User } from '../models/User';  
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AddUser } from '../models/add-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  constructor(private httpClient: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/Users/GetAll`);
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/Users/GetById/${id}`);     

    
  }

  getUserByName(name: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/Users/GetByUserName/${name}`);
  }

  addUser(user: AddUser): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Users/Insert`, user);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/Users/Update/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/Users/Delete/${id}`);
  }
}
