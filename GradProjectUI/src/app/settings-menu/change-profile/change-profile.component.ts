import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangePFPModel } from '../../models/Change-PFP.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environment";
import {SharedService} from "../../services/shared.service";
import { UserModel } from '../../models/user-model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',

})
export class ChangeProfileComponent {
  ChangePFP:FormGroup;
  ChangePFPModel:ChangePFPModel=new ChangePFPModel();
  selectedFile: File;
  user:UserModel;

  @ViewChild('fileInputProfile') fileInputProfile: any;

  @ViewChild('fileInputCover') fileInputCover: any;
  constructor( private router: Router, private authService: AuthService, private fb: FormBuilder,private sharedService: SharedService,private http: HttpClient,private toastr:ToastrService){
    this.ChangePFP = this.fb.group({
      fileUploadPic: '',
      fileUploadCover:''

    });
  }
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
  }


  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`/user/upload`, formData);
  }

  uploadCoverImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`/user/uploadCover`, formData);
  }

  onFileCoverChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUploadCover() {
    this.uploadCoverImage(this.selectedFile).subscribe(
      (response) => {
        console.log('Image uploaded successfully:', response);
        this.sharedService.updateProfile(true);
        this.toastr.success("Image uploaded successfully");
        this.fileInputCover.nativeElement.value = '';
      },
      (error) => {
        if (error.message === "Failed to upload imageNo file received or file is empty") {
        this.toastr.error('No image uplouded.');
        }
        else if (error.message === "Only image files are allowed") {
          this.toastr.error('Only image files are allowed');
          }
      }
    );
  }

  onUpload() {
    this.uploadImage(this.selectedFile).subscribe(
      (response) => {
        console.log('Image uploaded successfully:', response);
        this.toastr.success("Image uploaded successfully");
        this.sharedService.updateProfile(true);
        this.fileInputProfile.nativeElement.value = '';
      },
      (error) => {
        if (error.message === "Failed to upload imageNo file received or file is empty") {
        this.toastr.error('No image uplouded.');
        }
        else if (error.message === "Only image files are allowed") {
          this.toastr.error('Only image files are allowed');
          }
      }
    );
  }

}
