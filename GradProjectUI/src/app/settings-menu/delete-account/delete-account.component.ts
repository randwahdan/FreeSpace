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

  confirmDelete:FormGroup;
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder,private sharedService: SharedService,private toastr:ToastrService){
    this.confirmDelete = this.fb.group({
      confirmDeletion:'',
    });
  }
  DeleteAccount():void{
    const userInput = this.confirmDelete.controls['confirmDeletion'].value;

    if (userInput.toUpperCase() === 'DELETE') {
      this.authService.deleteAccount(userInput).subscribe(res => {
        this.router.navigateByUrl('/login');
        this.toastr.success('Your Account deleted successfully');
  }
  );}
    else {
      this.toastr.error('Please type "DELETE" in the box, to confirm deletion.');
    }
  }}
