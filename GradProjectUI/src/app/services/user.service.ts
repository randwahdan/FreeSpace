import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostModel} from "../models/post-model";
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService  {
  private apiUrl = 'https://localhost:4200/';

  constructor(private httpClient: HttpClient) {
  }
  getUserById(userId: string): Observable<UserModel> {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.httpClient.get<UserModel>(url);
  }

  getSuggestedFriends():  Observable<any> {
    return this.httpClient.get('/user/getNonFriends');
  }

  getFriends():  Observable<any> {
    return this.httpClient.get('/user/getFriends');
  }

  getPendingFriends():  Observable<any> {

    return this.httpClient.get('/user/getPendingFriends');
  }

  addFriend(friend:any):Observable<any>{
    return this.httpClient.post('/user/add-friend',friend);
  }

  responseFriend(friend:any):Observable<any>{
    return this.httpClient.post('/user/aceept-reject-friend',friend);
  }

}
