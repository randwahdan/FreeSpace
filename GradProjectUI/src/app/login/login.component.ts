import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {LoginModel} from "../models/login-model";
import {AuthService} from "../services/auth.service";
import { RegisterModel } from '../models/Register-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PostService} from "../services/post.service";
import {PostModel} from "../models/post-model";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl:'./login.component.scss'
})
export class LoginComponent {
loginForm:FormGroup;
hovered: boolean = false;
loginModel:LoginModel=new LoginModel();
passwordFieldType: string = 'password';
showPasswordText: string = 'Show';

constructor( private router: Router, private authService: AuthService, private fb: FormBuilder, private postService: PostService,private toastr: ToastrService ) {
    this.loginForm=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
    });
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.showPasswordText = this.showPasswordText === 'Show' ? 'Hide' : 'Show';
  }
  login(){
    // Get the form values from the login form
    var formValue = this.loginForm.value;
    // Assign form values to the properties of the login model
    this.loginModel.email = formValue.email;
    this.loginModel.password = formValue.password;
     // Call the login method of the authService, which likely makes an HTTP request
    this.authService.login(this.loginModel).subscribe(res => {
      // Successful response callback
      if (res.token) {
        // Store the JWT token in local storage
        localStorage.setItem('jwt', res.token);
        // Store the user object in local storage
        const userObj = JSON.stringify(res);
        localStorage.setItem('user',userObj);
        console.log(res);
        this.router.navigateByUrl('home/manage');
        this.toastr.success('Welcome..');
      } else {
        // Clear JWT token from local storage
        localStorage.removeItem('jwt');
      }
    }, (error) => {
      console.error('Login error:', error); // Log the error object to the console
      if (error.message === "Password needs to entered" || error.message === "Email address needs to entered") {
        this.toastr.error('Both Email and Password must be entered');
      }
      else {
        this.toastr.error('Login failed. Please try again.');
      }
    }
  );
}
}
