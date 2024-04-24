import {Component, OnInit} from '@angular/core';
import {UserModel} from "../../models/user-model";
import {UserService} from "../../services/user.service";
import {FriendRequestModel} from "../../models/friend-request";
import { Router } from '@angular/router';
@Component({
  selector: 'pending-list',
  templateUrl: './pending-list.component.html',
  styleUrl:'./pending-list.component.scss'
})
export class PendingFriendsList implements OnInit {
  users:UserModel[]=[];
  constructor(private  userService: UserService,private router: Router) {
  }
  ngOnInit(): void {
    this.getPendingFriends();
  }
  showAllFriends(){}
  showPendingFriends(){}

  getPendingFriends() {
    this.userService.getPendingFriends().subscribe(async result => {
      this.users = result

    });
  }

  response(user :any, acceptOrReject:boolean){
    let friendRequestModel=new FriendRequestModel();
    friendRequestModel.status = acceptOrReject==true? 'Approved':'Rejected';
    friendRequestModel.userSourceId=user.id;
    this.userService.responseFriend(friendRequestModel).subscribe(async result => {
      if(result==true){
        user.isAdded = true
      }
    });
  }
  navigateToUserProfile(userId: string): void {
    this.router.navigate(['/UserProfile', userId]);
  }
}
