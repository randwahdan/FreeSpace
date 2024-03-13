import {Component, OnInit,Input} from '@angular/core';
import {UserService} from "../services/user.service";
import {UserModel} from "../models/user-model";
import {FriendRequestModel} from "../models/friend-request";

@Component({
  selector: 'app-right-side-menu',
  templateUrl: './right-side-menu.component.html',
  styleUrl: 'right-side-menue.component.scss'
})
export class RightSideMenuComponent  implements OnInit{
  @Input() userId:any;
  users:UserModel[]=[];
  user:UserModel;
  constructor(private  userService: UserService) {
  }
  ngOnInit(): void {
    this.getSuggestedFriends();
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;

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
