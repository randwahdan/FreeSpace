import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { ChangePasswordModel } from '../../models/Change-password.model';
@Component({
  selector: 'changePassword',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  ChangePassword:FormGroup;
  ChangePasswordModel:ChangePasswordModel=new ChangePasswordModel();
  constructor( private router: Router, private authService: AuthService, private fb: FormBuilder){
    this.ChangePassword = this.fb.group({
      oldPassword: '',
      newPassword:['', [Validators.required]],
      confirmPassword:['', [Validators.required]],
    });
  }

  UpdatePassword(){
    var formValue = this.ChangePassword.value;
    this.ChangePasswordModel.oldPassword = formValue.oldPassword;
    this.ChangePasswordModel.newPassword = formValue.newPassword;
    this.ChangePasswordModel.confirmPassword = formValue.confirmPassword;
    this.authService.UpdatePassword(this.ChangePasswordModel).subscribe(res => {
      this.router.navigateByUrl('login');
    });
  }
}
