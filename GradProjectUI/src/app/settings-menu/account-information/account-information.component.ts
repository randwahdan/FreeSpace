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
    });
    }
    onResetClick(){
      this.BasicInfo.reset();
    }
}
