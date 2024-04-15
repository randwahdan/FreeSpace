import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup ,ReactiveFormsModule} from '@angular/forms'; // Remove FormsModule and ReactiveFormsModule imports
import { PostModel } from '../models/post-model';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { UserModel } from '../models/user-model';
import { SharedService } from '../services/shared.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-mange-post',
  templateUrl: './mange-post.component.html',
  styleUrl: './manage-post.component.scss'
})

export class MangePostComponent implements OnInit {
  user: UserModel;
  @ViewChild('fileUploadImage') fileInputImage: any;
  @ViewChild('fileUploadVideo') fileInputVideo: any;
  postForm: FormGroup;
  selectedImages: File[] | null = null;
  selectedVideos: File[] | null = null;
  // Allowed file extensions
  allowedImageExtensions = ['.jpg', '.jpeg', '.png'];
  allowedVideoExtensions = ['.mp4', '.avi', '.mov', '.wmv'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private postService: PostService,
    private sharedService: SharedService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.postForm = this.fb.group({
      content: ''
    });
  }

  ngOnInit(): void {
    // Load user details from local storage
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  onImageSelected(event: any): void {
    this.selectedImages = this.filterFilesByExtension(event.target.files, this.allowedImageExtensions);
  }

  onVideoSelected(event: any): void {
    this.selectedVideos = this.filterFilesByExtension(event.target.files, this.allowedVideoExtensions);
  }

  filterFilesByExtension(files: FileList, allowedExtensions: string[]): File[] {
    const filteredFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name ? '.' + file.name.split('.').pop()?.toLowerCase() : '';
      if (allowedExtensions.includes(extension)) {
        filteredFiles.push(file);
      }
    }
    return filteredFiles;
  }

  createPost(): void {
    const formValue = this.postForm.value;
    const postModel = new PostModel();
    postModel.content = formValue.content;

    const formData: FormData = new FormData();
    formData.append('postModel', JSON.stringify(postModel));

    // Append selected images and videos to FormData
    if (this.selectedImages) {
      for (const image of this.selectedImages) {
        formData.append('files', image, image.name);
      }
    }
    if (this.selectedVideos) {
      for (const video of this.selectedVideos) {
        formData.append('files', video, video.name);
      }
    }

    // Send POST request to create post
    this.http.post<any>('/post/create-post', formData)
      .pipe(
        catchError(error => {
          console.error('Error creating post:', error);
          let errorMessage = 'An error occurred while creating the post.';
          if (error.status === 400) {
            errorMessage = error.error; // Assuming the error message is sent in the response body
          }
          return throwError(errorMessage);
        })
      )
      .subscribe(() => {
        this.postForm.reset();
        this.selectedImages = null;
        this.selectedVideos = null;
        this.sharedService.updatePosts(true);
        this.toastr.success('Your post was created successfully.');
      });
  }
}
