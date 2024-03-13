import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostModel } from '../models/post-model';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { UserModel } from '../models/user-model';
import { SharedService } from '../services/shared.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mange-post',
  templateUrl: './mange-post.component.html',
  styleUrl: './manage-post.component.scss'
})

export class MangePostComponent  implements OnInit{
  user:UserModel;
  //to access child element in template
  @ViewChild('fileUpload') fileInputProfile: any;
  postForm:FormGroup;
  selectedFile: File[] | null = null;
  constructor( private router: Router,
     private fb: FormBuilder,
      private postService: PostService,
      private sharedService: SharedService,
      private http: HttpClient){
      // Initialize the form in the constructor
      this.postForm = this.fb.group({
      content:''
    });
}

ngOnInit(): void {
  let userStorge=localStorage.getItem('user');
  this.user  = userStorge ? JSON.parse(userStorge) : null;

  this.sharedService.profile$.subscribe((isPosCreated) => {
    if(isPosCreated) {
      let userStorge=localStorage.getItem('user');
      this.user  = userStorge ? JSON.parse(userStorge) : null;
    }
  });
 }

 onFileSelected(event: any): void {
  const files = event.target.files;
  if (files && files.length > 0) {
    this.selectedFile = files;
  }
}

onImageClick(event: Event): void {
  // Trigger a click event on the hidden file input
  if (this.fileInputProfile) {
    this.fileInputProfile.click();
  }
}


Post(){

  let formValue=this.postForm.value;
  let postModel=new PostModel();
  postModel.content =formValue.content;
  const formData: FormData = new FormData();
  formData.append('postModel', JSON.stringify(postModel));
  if( this.selectedFile !=null){
    for (let index = 0; index < this.selectedFile.length; index++) {
      debugger
        formData.append('file'+index, this.selectedFile[index], this.selectedFile[index].name);
    }
  }
  this.http.post(`/post/create-post`,formData).subscribe(async result => {
    formValue.content = '';
    this.postForm.reset();
    this.sharedService.updatePosts(true);
    this.fileInputProfile.nativeElement.value = '';
  });
}
}
