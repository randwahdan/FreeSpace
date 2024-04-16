import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user-model';
import { ActivatedRoute } from '@angular/router';
import {UserService} from "../services/user.service";

@Component({
  selector: 'profilePage',
  templateUrl: './profile-page.component.html',
})
export class ProfilePage implements OnInit{
  user:UserModel;
  users:UserModel[]=[];
  userId: any;
  constructor(private route: ActivatedRoute,private  userService: UserService) {}
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
    this.userId = this.route.snapshot.paramMap.get('id');
   }
}
