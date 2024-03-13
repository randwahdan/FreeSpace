import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountInfo } from '../../models/Account-Info.model';
import { AuthService } from '../../services/auth.service';
import {Router} from "@angular/router";
import { SharedService } from '../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'deleteAccount',
  templateUrl: './delete-account.component.html',
})
export class DeleteAccountComponent {
  AccountInfo:AccountInfo=new AccountInfo();
  BasicInfo:FormGroup;
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder,private sharedService: SharedService,private toastr:ToastrService){
  }
}
