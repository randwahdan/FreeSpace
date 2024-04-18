export class CommentModel {
  postId: any;
  commentId: any;
  content: string;
  profilePicture: string;
  fullName: string;
  createdDate: Date;
  likesCount: number;
  isLiked: boolean;

  constructor() {
    this.postId = null; // Initialize postId to null or appropriate value
    this.content = ''; // Initialize content to empty string
    this.profilePicture = ''; // Initialize profilePicture to empty string
    this.fullName = ''; // Initialize fullName to empty string
    this.createdDate = new Date(); // Initialize createdDate to current date/time
    this.likesCount = 0; // Initialize likesCount to 0
    this.isLiked = false; // Initialize isLiked to false
  }
}
