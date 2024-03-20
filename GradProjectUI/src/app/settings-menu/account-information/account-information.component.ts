import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountInfo } from '../../models/Account-Info.model';
import { AuthService } from '../../services/auth.service';
import {Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrl:'./account-information.component.scss'
})
export class AccountInformationComponent {
  AccountInfo:AccountInfo=new AccountInfo();
  BasicInfo:FormGroup;
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder,private sharedService: SharedService,private toastr:ToastrService){
    this.BasicInfo = this.fb.group({
      bio:'',
      nickname:''
    });
  }
  SaveInfo(){
    var formValue = this.BasicInfo.value;
    this.AccountInfo.Bio =formValue.bio;
    this.AccountInfo.Nickname =formValue.nickname;
    this.authService.SaveInfo(this.AccountInfo).subscribe(res => {
    this.sharedService.updateProfile(true);
    this.BasicInfo.reset();
    this.toastr.success("Your Info successfully Updated");
  },
  (error) => {
    console.error(' error:', error); // Log the error object to the console
    // Handle different error messages
    if (error.message === "Invalid data received") {
      this.toastr.error('All the fields are required');
    }
    else if(error.message === "Bio and Nickname cannot be empty"){
    
    }
    });
    }
    onResetClick(){
      this.BasicInfo.reset();
    }
}
