import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {LoginModel} from "../models/login-model";
import {AuthService} from "../services/auth.service";
import { RegisterModel } from '../models/Register-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PostService} from "../services/post.service";
import {PostModel} from "../models/post-model";

 @Component({
  selector: 'app-login',
  templateUrl: './login.component.html',

})
export class LoginComponent {
registerationForm: FormGroup;
loginForm:FormGroup;
loginModel:LoginModel=new LoginModel();
RegisterModel:RegisterModel=new RegisterModel();

  constructor( private router: Router, private authService: AuthService, private fb: FormBuilder, private postService: PostService) {
     // Initialize the form in the constructor
     this.registerationForm = this.fb.group({
      firstname: '',
      lastname:'',
      email: ['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      dateOfBirth:'',
      gender:''
    });
    


    this.loginForm=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
    
    });
   

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

      } else {
        
        // Clear JWT token from local storage
        localStorage.removeItem('jwt');
      }
    }, (error) => {
      console.error('Login error:', error); // Log the error object to the console
       if (error.message === "Password needs to entered" || error.message === "Email address needs to entered") {
        this.showPopup('Error', 'Both Email and Password must be entered');
      }  
      else {
        this.showPopup('Error', 'Login failed. Please try again.');
      }
    }
  );
 }


   Register(){

    // Get the form values from the registration form
    var formValue = this.registerationForm.value;
        
    // Assign form values to the properties of the Registeration model
    this.RegisterModel.FirstName=formValue.firstname;
    this.RegisterModel.LastName=formValue.lastname;
    this.RegisterModel.Email=formValue.email;
    this.RegisterModel.Password=formValue.password;
    this.RegisterModel.DateOfBirth=formValue.dateOfBirth;
    if (formValue.gender === "female") {
      this.RegisterModel.Gender = 2;
    } else if (formValue.gender === "male") {
      this.RegisterModel.Gender = 1;
    }

    this.authService.Register(this.RegisterModel).subscribe(res=>{
      localStorage.setItem('jwt',res.token);
        // Registration successful
        this.showPopup('Success', 'You Registered Successfully');
        // Reset the form after successful registration
        this.registerationForm.reset();
        // Redirect to login after a short delay (you might want to use a router event to handle this more elegantly)
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      (error) => {
        console.error('Registration error:', error); // Log the error object to the console
  
        if (error.message === "Email is already registered") {
          this.showPopup('Error', 'This email is already associated with an account. Please use a different email.');
        }else if(error.message === "First Name needs to entered"){
          this.showPopup('Error', 'First Name needs to be entered.');
        }
        else if(error.message === "Last Name needs to entered"){
          this.showPopup('Error', 'Last Name needs to be entered.');
        }
        else if(error.message === "Email needs to entered"){
          this.showPopup('Error', 'Email needs to be entered.');
        }
        else if(error.message === "Invalid email syntax"){
          this.showPopup('Error', 'Invalid email pattern  , Please enter email.');
        }
        else if(error.message === "Password needs to entered"){
          this.showPopup('Error', 'Password needs to be entered.');
        }
         else {
          this.showPopup('Error', 'Registration failed. Please try again.');
        }
      }
    );
   }
   showPopup(title: string, message: string) {
    // Implement your popup logic here (e.g., using a library or custom component)
    alert(`${title}\n${message}`);
  }
  
}
