import { MediModel } from "./Media";
import { CommentModel } from "./comment-model";

export class PostModel {
    postId!:any;
    fullName!:string;
    content!:string;
    createdDate !:Date;
    isLiked:boolean;
    likesCount: number;
    profilePicture!:string;
    comments:CommentModel[];
    media:MediModel[];
}
