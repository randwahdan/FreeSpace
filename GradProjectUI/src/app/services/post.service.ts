import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostModel} from "../models/post-model";
import { Observable } from 'rxjs';
import { CommentModel } from '../models/comment-model';

@Injectable({
  providedIn: 'root'
})
export class PostService   {

  constructor(private httpClient: HttpClient) {
  }
  getPost():  Observable<any> {
    return this.httpClient.get('/post/get-posts');
  }

  makeLike(PostModel:any):Observable<any>{
return this.httpClient.post('/post/make-like',PostModel);
  }

  makeDisLike(PostModel:any):Observable<any>{

    return this.httpClient.post('/post/make-disLike',PostModel);
      }

      makeCommentLike(CommentModel:any):Observable<any>{
        return this.httpClient.post('/post/like-comment',CommentModel);
          }

          makeCommentDisLike(CommentModel:any):Observable<any>{

            return this.httpClient.post('/post/make-comment-dislike',CommentModel);
              }

              makeComment(comment:any):Observable<any>{
                debugger
                return this.httpClient.post('/post/make-comment',comment);
              }

      getPostByUser(userId:any):  Observable<any> {
        debugger
        return this.httpClient.get(`/post/get-posts/${userId}`);
      }

  getNotifications():  Observable<any> {
    return this.httpClient.get('/post/get-notification');
  }

}
