import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../models/user-model';
import { PostModel } from '../models/post-model';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { LikeModel } from '../models/like-model';
import { SharedService } from '../services/shared.service';
import { CommentModel } from "../models/comment-model";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl:'./post-list.component.scss'
})
export class PostListComponent implements OnInit {
  commentForm: FormGroup;
  user: UserModel;
  post: PostModel;
  postModelList: PostModel[] = [];
  isCurrentPostLiked = false;
  showCommentSection = false;
  @Input() userId: any;
  constructor(private postService: PostService, private sharedService: SharedService, private fb: FormBuilder,private toastr:ToastrService) {
    this.commentForm = this.fb.group({
      content: '',
    });

  }

  ngOnInit(): void {

    this.sharedService.posts$.subscribe((isPosCreated) => {
      if (isPosCreated) {
        this.getPosts();
      }
    });

    this.sharedService.comment$.subscribe((isCommentCreated) => {
      if (isCommentCreated) {
        this.getPosts();
      }
    });
    if (this.userId == null) {
      this.getPosts();
    }
    else {
      this.getUserPosts(this.userId);
    }

  }

  getPosts() {
    this.postService.getPost().subscribe(async result => {

      this.postModelList = result;
      console.log(result);

    });

  }
  getUserPosts(userId: any) {

    this.postService.getPostByUser(userId).subscribe(async result => {
      this.postModelList = result;
      console.log(result);

    });

  }
  makeLike(post: any) {

    let likeModel = new LikeModel();
    likeModel.postId = post.postId;
    this.postService.makeLike(likeModel).subscribe(async result => {

      if (result == true) {

        post.isLiked = true
        post.likesCount += 1;
      }

    });
  }

  makeDislike(post: any) {

    let likeModel = new LikeModel();
    likeModel.postId = post.postId;
    this.postService.makeDisLike(likeModel).subscribe(async result => {

      if (result == true) {
        this.sharedService.updateComments(true);
        post.isLiked = false;
        post.likesCount -= 1;

      }

    });
  }
  addComment(post: any) {
    let commentModel = new CommentModel();
    var formValue = this.commentForm.value;

    // Check if the comment content is empty
    if (!formValue.content.trim()) {
      // Display an error message or handle the empty content case as needed
      return; // Exit the method
    }

    commentModel.content = formValue.content;
    commentModel.postId = post.postId;

    this.postService.makeComment(commentModel).subscribe(async result => {
      if (result == true) {
        this.sharedService.updateComments(true);
        formValue.content = '';
        this.commentForm.reset();
      }
    });
  }

  toggleCommentSection(post: any): void {
    post.comments = !post.comments;
  }
}
