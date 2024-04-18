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
  private apiUrl = 'https://localhost:7086/api';
  constructor(private httpClient: HttpClient) {
  }
  getUserProfile(userId: string): Observable<any> {
    const url = `${this.apiUrl}/UserProfile/${userId}`;
    return this.httpClient.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user profile:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
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
