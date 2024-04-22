import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse } from "@angular/common/http";
import {PostModel} from "../models/post-model";
import { Observable,throwError  } from 'rxjs';
import { UserModel } from '../models/user-model';
import { UserProfileModel } from '../models/userProfile';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService  {
  constructor(private httpClient: HttpClient) {
  }

  getNonFriends():  Observable<any> {
    return this.httpClient.get('/user/getNonFriends');
  }

  getSuggestedFriends():  Observable<any> {
    return this.httpClient.get('/user/getNonFriendsWithCommonFriends');
  }
  getUserById(userId:any):  Observable<any> {
    return this.httpClient.get(`/user/get-user/${userId}`);
  }

  getFriends():  Observable<any> {
    return this.httpClient.get('/user/getFriends');
  }

  getMutualFriends(userId:any):  Observable<any> {
    return this.httpClient.get(`/user/getFriends/${userId}`);
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
  searchUsers(searchTerm: string):  Observable<any> {
    return this.httpClient.get(`/user/search/${searchTerm}`);
  }
}
