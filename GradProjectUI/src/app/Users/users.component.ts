import { Component,OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {UserModel} from "../models/user-model";
import {FriendRequestModel} from "../models/friend-request";
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl:'./users.component.scss'
})
export class UsersListComponent implements OnInit {
  users:UserModel[]=[];
  constructor(private  userService: UserService, private router: Router) {
  }
  ngOnInit(): void {
    this.getSuggestedFriends();
  }
  getSuggestedFriends() {

    this.userService.getSuggestedFriends().subscribe(async result => {
      this.users = result
    });
  }

  addFriend(user :any){
    let friendRequestModel=new FriendRequestModel();
    friendRequestModel.userTargetId=user.id;
    friendRequestModel.userSourceId=null;
    this.userService.addFriend(friendRequestModel).subscribe(async result => {

      if(result==true){
        user.isAdded = true
      }

    });
  }
  navigateToUserProfile(userId: string): void {
    this.router.navigate(['/UserProfile', userId]);
  }

}
