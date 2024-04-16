import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserModel } from '../models/user-model';
import { PostModel } from '../models/post-model';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { LikeModel } from '../models/like-model';
import { SharedService } from '../services/shared.service';
import { CommentModel } from "../models/comment-model";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  commentForm: FormGroup;
  user: UserModel;
  post: PostModel;
  commentVisibilityMap: { [postId: number]: boolean } = {};
  postModelList: PostModel[] = [];
  isCurrentPostLiked = false;
  showCommentSection = false;
  lastCommentIndex: number = -1;
  @Input() userId: any;
  constructor(
    private postService: PostService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.commentForm = this.fb.group({
      content: '',
    });
  }

  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;

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
    } else {
      this.getUserPosts(this.userId);
    }
  }


  isVideo(media: any): boolean {
    return media && media.isVideo; // Assuming that 'isVideo' property indicates if the media is a video
  }
  getPosts() {
    this.postService.getPost().subscribe(result => {
      debugger
      this.postModelList = result;
      this.postModelList.forEach(post => {
        post.media.forEach(media => {
          media.isVideo = this.isVideo(media); // Set the 'isVideo' property for each media item
        });
      });
      console.log(result);
    });
  }

  getUserPosts(userId: any) {
    this.postService.getPostByUser(userId).subscribe(result => {
      this.postModelList = result;
      this.postModelList.forEach(post => {
        post.media.forEach(media => {
          media.isVideo = this.isVideo(media); // Set the 'isVideo' property for each media item
        });
      });
      console.log(result);
    });
  }
  handleVideoError(event: Event) {
    // Handle the video error
    console.error('Video error occurred:', event);
    // You can display an error message to the user or perform any other action here
  }



  makeLike(post: any) {
    let likeModel = new LikeModel();
    likeModel.postId = post.postId;
    this.postService.makeLike(likeModel).subscribe(result => {
      if (result == true) {
        post.isLiked = true;
        post.likesCount += 1;
      }
    });
  }

  makeDislike(post: any) {
    let likeModel = new LikeModel();
    likeModel.postId = post.postId;
    this.postService.makeDisLike(likeModel).subscribe(result => {
      if (result == true) {
        this.sharedService.updateComments(true);
        post.isLiked = false;
        post.likesCount -= 1;
      }
    });
  }

  addComment(post: any) {
    const formValue = this.commentForm.value;

    if (!formValue.content.trim()) {
      return; // Exit if comment content is empty
    }

    let commentModel = new CommentModel();
    commentModel.content = formValue.content;
    commentModel.postId = post.postId;

    this.postService.makeComment(commentModel).subscribe(result => {
      if (result == true) {
        // Update the comment list for the specific post
        if (!post.comments) {
          post.comments = []; // Initialize comments array if it's undefined
        }
        post.comments.push({
          profilePicture: this.user.profilePicture, // Assuming user has a profilePicture property
          fullName: this.user.fullName, // Assuming user has a fullName property
          createdDate: new Date(), // Assuming comment has a createdDate property
          content: formValue.content
        });

        // Clear the form after adding the comment
        formValue.content = '';
        this.commentForm.reset();

        // Optionally, update the shared service to trigger comment updates
        this.sharedService.updateComments(true);
      }
    });
  }

  toggleCommentSection(postId: number): void {
    this.commentVisibilityMap[postId] = !this.commentVisibilityMap[postId];
  }


  isCommentSectionVisible(postId: number): boolean {
    return this.commentVisibilityMap[postId] || false; // Return false if undefined
  }
}
