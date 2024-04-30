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
import { CommentLikeModel } from '../models/commentLike-model';
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
    private toastr: ToastrService,
    private router:Router
  ) {
    this.commentForm = this.fb.group({
      content: '',
    });
  }
  ngOnInit(): void {
    let userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    this.fetchPosts(); // Load posts initially
    // Subscribe to shared service to listen for post and comment updates
    this.sharedService.posts$.subscribe((isPosCreated) => {
      if (isPosCreated) {
        this.fetchPosts(); // Refresh posts when new post is created
      }
    });
    this.sharedService.comment$.subscribe((isCommentCreated) => {
      if (isCommentCreated) {
        this.fetchPosts(); // Refresh posts when new comment is created
      }
    });
    this.sharedService.commentLikes$.subscribe((isCommentLikes) => {
      // Check if any comment likes are updated
      if ((isCommentLikes)) {
        this.fetchPosts(); // Refresh posts when comment likes are updated
      }
    });
  }
  fetchPosts(): void {
    const postSubscription = this.userId == null ?
      this.postService.getPost() :
      this.postService.getPostByUser(this.userId);

    postSubscription.subscribe(
      (result: PostModel[]) => {
        this.postModelList = result || [];
        this.postModelList.forEach(post => {
          if (post.media && Array.isArray(post.media)) {
            post.media.forEach(media => {
              media.isVideo = this.isVideo(media);
            });
          }
        });
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.handlePostFetchError();
      }
    );
  }

  private handlePostFetchError(): void {
    // You can customize error handling based on error types here
    this.toastr.error('Failed to fetch posts. Please try again.');
  }


  isVideo(media: any): boolean {
    return media && media.isVideo; // Assuming 'isVideo' property indicates if the media is a video
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
  makeLikeComment(comment: any): void {
    debugger
    if (!comment || !comment.commentId) {
      console.error("Invalid comment or commentId");
      return;
    }
    const commentId = comment.commentId;
    let commentLikeModel = new CommentLikeModel();
    commentLikeModel.commentId = commentId;
    this.postService.makeCommentLike(commentLikeModel).subscribe(
      (result) => {
        if (result === true) {
          this.sharedService.updateCommentLikes(true);
          comment.isLiked = true; // Update the 'isLiked' property of the comment object
          comment.likesCount += 1;
        } else {
          this.toastr.error('Failed to like this comment.');
        }
      },
      (error) => {
        console.error('Error liking comment:', error);
        this.toastr.error('Failed to like this comment.');
      }
    );
  }


  makeCommentDislike(comment: any): void {
    debugger
    if (!comment || !comment.commentId) {
      console.error("Invalid comment or commentId");
      return;
    }

    const commentId = comment.commentId;

    let commentLikeModel = new CommentLikeModel();
    commentLikeModel.commentId = commentId;

    this.postService.makeCommentDisLike(commentLikeModel).subscribe(
      (result) => {
        if (result === true) {
          // Update the 'isLiked' property of the comment object to false
          comment.isLiked = false;
          // Decrease the likes count
          comment.likesCount -= 1;
          // Notify subscribers of the updated likes
          this.sharedService.updateCommentLikes(false);
        } else {
          this.toastr.error('Failed to dislike this comment.');
        }
      },
      (error) => {
        console.error('Error disliking comment:', error);
        this.toastr.error('Failed to dislike this comment.');
      }
    );
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
    debugger
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
    return this.commentVisibilityMap[postId] || false;
  }

getMaxCommentLikes(post: PostModel): number {
  if (!post || !post.comments || post.comments.length === 0) {
    return 0;
  }

  const likesCounts = post.comments.map(comment => comment.likesCount);

  const allSameLikesCount = likesCounts.every(likes => likes === likesCounts[0]);
  const allZeroLikesCount = likesCounts.every(likes => likes === 0);

  if (allSameLikesCount || allZeroLikesCount) {
    return -1;
  }

  return Math.max(...likesCounts);
}

}
