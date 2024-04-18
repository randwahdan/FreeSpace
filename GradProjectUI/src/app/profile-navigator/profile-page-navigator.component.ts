import { Component, OnInit } from '@angular/core';
import { UserProfileModel } from '../models/userProfile';
import { ActivatedRoute } from '@angular/router';
import {UserService} from "../services/user.service";

@Component({
  selector: 'profilePageNavigator',
  templateUrl: './profile-page-navigator.component.html',
})
export class ProfilePageNavigator implements OnInit{
  user:UserProfileModel;
  users:UserProfileModel[]=[];
  userId: any;
  constructor(private route: ActivatedRoute,private  userService: UserService) {}
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
    this.userId = this.route.snapshot.paramMap.get('id');
    }
}
