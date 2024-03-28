import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostModel } from '../models/post-model';
import {AuthService} from "./auth.service";
import { CommentModel } from '../models/comment-model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private  authService:AuthService ) {
  }
    private postsSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    posts$ = this.postsSubject.asObservable();

    private eventsSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
    events$ = this.eventsSubject.asObservable();

  private profileSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  profile$ = this.profileSubject.asObservable();

  private commentSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  comment$ = this.commentSubject.asObservable();

  private infoSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  info$ = this.infoSubject.asObservable();

  updatePosts(isPostUpdated:boolean) {
    this.postsSubject.next(isPostUpdated);
  }
  updateEvents(isEventUpdated:boolean) {
    this.eventsSubject.next(isEventUpdated);
  }
  updateUserInfo(isUpdateUserInfo:boolean){
    this.infoSubject.next(isUpdateUserInfo);
  }

  updateComments(iCommentUpdated:boolean) {
    this.commentSubject.next(iCommentUpdated);
  }

  updateProfile(isProfileUpdated:boolean) {

    this.authService.getUser().subscribe(async res => {

      if (res.token) {
        localStorage.setItem('jwt', res.token);
        const userObj = JSON.stringify(res);
        localStorage.setItem('user',userObj);

      } else {
        debugger
        // Clear JWT token from local storage
        localStorage.removeItem('jwt');
      }
    });

    this.profileSubject.next(isProfileUpdated);
  }
}
