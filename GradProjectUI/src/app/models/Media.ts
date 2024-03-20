import { CommentModel } from "./comment-model";

export class MediModel {
    url:any;
    isVideo: boolean;

    constructor(url: string, isVideo: boolean) {
        this.url = url;
        this.isVideo = isVideo;
    }
}
