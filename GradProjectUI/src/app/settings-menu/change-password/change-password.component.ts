import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { ChangePasswordModel } from '../../models/Change-password.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'changePassword',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  ChangePassword:FormGroup;
  ChangePasswordModel:ChangePasswordModel=new ChangePasswordModel();
  constructor( private router: Router, private authService: AuthService, private fb: FormBuilder, private toastr:ToastrService){
    this.ChangePassword = this.fb.group({
      oldPassword:'',
      newPassword:'',
      confirmPassword:''
    });
  }

  UpdatePassword(){
    var formValue = this.ChangePassword.value;
    this.ChangePasswordModel.oldPassword =formValue.oldPassword;
    this.ChangePasswordModel.newPassword =formValue.newPassword;
    this.ChangePasswordModel.confirmPassword =formValue.confirmPassword;
    this.authService.UpdatePassword(this.ChangePasswordModel).subscribe(res => {
    this.ChangePassword.reset();
    this.toastr.success('Password updated successfully');
    this.router.navigateByUrl('/login');
  },
  (error) => {
    console.error(' error:', error); // Log the error object to the console
    // Handle different error messages
    if (error.message === "Invalid data received") {
      this.toastr.error('All the fields are required');
    this.ChangePassword.reset();
    } else if (error.message === "Old password is incorrect") {
      this.toastr.error('Incorrect Password, Try again');
      this.ChangePassword.reset();

    } else if (error.message === "New password and confirm password do not match") {
      this.toastr.error('New password and confirm password do not match.');
      this.ChangePassword.reset();

    }
  }
);
}
}
