import { Component, OnInit,Input, Output } from '@angular/core';
import { UserModel } from '../../models/user-model';
import {SharedService} from "../../services/shared.service";

@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetails implements OnInit{
  user:UserModel;

  constructor(private sharedService: SharedService) {
  }
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
    this.sharedService.profile$.subscribe((isPosCreated) => {
      if(isPosCreated) {
        let userStorge=localStorage.getItem('user');
        this.user  = userStorge ? JSON.parse(userStorge) : null;
      }
    });
  }
}
