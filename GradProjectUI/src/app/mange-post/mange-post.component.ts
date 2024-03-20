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
  selectedFiles: File[] | null = null;

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
    let userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;

    this.sharedService.profile$.subscribe((isPostCreated) => {
      if (isPostCreated) {
        let userStorage = localStorage.getItem('user');
        this.user = userStorage ? JSON.parse(userStorage) : null;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  onImageClick(event: Event): void {
    if (this.fileInputImage) {
      this.fileInputImage.click();
    }
  }

  onVideoClick(event: Event): void {
    if (this.fileInputVideo) {
      this.fileInputVideo.click();
    }
  }

  Post() {
    let formValue = this.postForm.value;
    let postModel = new PostModel();
    postModel.content = formValue.content;
    const formData: FormData = new FormData();
    formData.append('postModel', JSON.stringify(postModel));

    if (this.selectedFiles != null) {
      for (let index = 0; index < this.selectedFiles.length; index++) {
        formData.append('files', this.selectedFiles[index], this.selectedFiles[index].name);
      }
    }

    this.http.post(`/post/create-post`, formData)
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
      .subscribe(async result => {
        formValue.content = '';
        this.postForm.reset();
        this.sharedService.updatePosts(true);
        this.toastr.success('Your post was created successfully.');
        this.selectedFiles = null;
      });
  }
}
