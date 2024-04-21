import { MediModel } from "./Media";
import { CommentModel } from "./comment-model";
import { LikeModel } from "./like-model";
export class PostModel {
  postId: number;
  profilePicture: string;
  fullName: string;
  createdDate: Date;
  content: string;
  media: any[]; // Array of media objects
  likesCount: number;
  isLiked: boolean;
  comments: any[]; // Array of comment objects
  showCommentSection: boolean; // New property to track comment section visibility
  commentId: any;
  likes: LikeModel[]; // Array of likes associated with the post

  constructor() {
    this.profilePicture = '';
    this.fullName = '';
    this.createdDate = new Date();
    this.content = '';
    this.media = [];
    this.likesCount = 0;
    this.isLiked = false;
    this.comments = [];
    this.showCommentSection = false; // Initialize showCommentSection as false by default
  }
}
