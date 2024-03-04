import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {UserModel} from "../models/user-model";
import {FriendRequestModel} from "../models/friend-request";

@Component({
  selector: 'app-left-side-menu',
  templateUrl: './left-side-menu.component.html',
  styleUrl: './left-side-menu.component.scss'
})
export class LeftSideMenuComponent implements OnInit {
  users:UserModel[]=[];
  constructor(private  userService: UserService) {
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

}
