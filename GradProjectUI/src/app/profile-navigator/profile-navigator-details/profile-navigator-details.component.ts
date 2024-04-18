import { Component, OnInit,Input, Output } from '@angular/core';
import { UserProfileModel } from '../../models/userProfile';
import {SharedService} from "../../services/shared.service";

@Component({
  selector: 'profile-navigator-details',
  templateUrl: './profile-navigator-details.component.html',
})
export class ProfileNavigatorDetails implements OnInit{
  user:UserProfileModel;

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
