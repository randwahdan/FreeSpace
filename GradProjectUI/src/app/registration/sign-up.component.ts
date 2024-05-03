import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import { RegisterModel } from '../models/Register-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PostService} from "../services/post.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrl:'./sign-up.component.scss'
})

export class RegisterComponent {

registerationForm: FormGroup;
RegisterModel:RegisterModel=new RegisterModel();
passwordFieldType: string = 'password';
showPasswordText: string = 'Show';
  constructor( private router: Router, private authService: AuthService, private fb: FormBuilder, private postService: PostService,private toastr: ToastrService) {
     // Initialize the form in the constructor
      this.registerationForm = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        country: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]], // Example: Minimum length of 6 characters
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required]
    });
  }
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    this.showPasswordText = this.showPasswordText === 'Show' ? 'Hide' : 'Show';
  }
  Register(){
    if (this.registerationForm.invalid) {
      // If the form is invalid, mark all fields as touched to display validation errors
      this.registerationForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
    }

    // Get the form values from the registration form
    var formValue = this.registerationForm.value;
    const dateOfBirth = new Date(formValue.dateOfBirth);
    const currentDate = new Date();

  // Check if the date of birth is in the future
  if (dateOfBirth > currentDate) {
    // Show toastr notification for invalid date of birth
    this.toastr.error('Birth date cannot be in the future.');
    return; // Exit the function if date of birth is in the future
  }
    // Assign form values to the properties of the Registeration model
    this.RegisterModel.FirstName=formValue.firstname;
    this.RegisterModel.LastName=formValue.lastname;
    this.RegisterModel.Email=formValue.email;
    this.RegisterModel.Country=formValue.country;
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
       // this.showPopup('Success', 'You Registered Successfully');
        this.toastr.success('You Registered Successfully');
        // Reset the form after successful registration
        this.registerationForm.reset();
        // Redirect to login after a short delay (you might want to use a router event to handle this more elegantly)
        this.router.navigateByUrl('/login');
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      (error) => {
        console.error('Registration error:', error); // Log the error object to the console
        this.router.navigateByUrl('/register');
        if (error.message === "Email is already registered") {
          this.toastr.error('This email is already associated with an account. Please use a different email.');
        }else if(error.message === "First Name needs to entered"){
          this.toastr.error('First Name needs to be entered.');
        }
        else if(error.message === "Last Name needs to entered"){
          this.toastr.error('Last Name needs to be entered.');
        }
        else if(error.message === "Email needs to entered"){
          this.toastr.error('Email needs to be entered.');
        }
        else if(error.message === "Invalid email syntax"){
          this.toastr.error('Invalid email pattern  , Please enter email.');
        }
        else if(error.message === "Country of Residence needs to entered"){
          this.toastr.error('Country of Residence needs to be entered..');
        }
        else if(error.message === "Password needs to entered"){
          this.toastr.error('Password needs to be entered.');
        }
        else {
          this.toastr.error('Registration failed. Please try again.');
        }
      }
    );
  }
}
