import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import {SharedService} from "../services/shared.service";
import {PostService} from "../services/post.service";
import {NotificationModel} from "../models/Notification-model";
import { AuthService } from '../services/auth.service';
import { EventModel } from '../models/Event.model';
import { UserProfileModel } from '../models/userProfile';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'

})
export class HeaderComponent implements OnInit {
  @Input() userId:any;
  @Input() eventModel: EventModel;
  hideActionMenu=false;
  hideActionMenu2: boolean = true;
  user:UserModel;
  notificationsModels:NotificationModel[]=[];
  searchTerm: string = '';
  showMenu: boolean = false;
  searchResults: any[] = [];
  users: UserProfileModel[] = [];

  constructor(private router: Router, private sharedService: SharedService, private  postService :PostService, private userService :UserService){

  }
  ngOnInit(): void {

    this.getNotifications();
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;

    this.sharedService.profile$.subscribe((isPosCreated) => {
      if(isPosCreated) {
        let userStorge=localStorage.getItem('user');
        this.user  = userStorge ? JSON.parse(userStorge) : null;
      }
    });

   }
   Logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
   }
   settingsMenuToggle(){
    this.hideActionMenu =!this.hideActionMenu;
   }
   viewUserDetail() {
    this.router.navigate(['/ProfilePage', this.user.id]);
  }
  toggleMenu(){
    this.hideActionMenu2 =!this.hideActionMenu2;

  }

  getNotifications() {
    this.postService.getNotifications().subscribe(async result => {
      this.notificationsModels = result

    });
  }
  navigateToUserProfile(userId: string): void {
    this.router.navigate(['/UserProfile', userId]);
  }
  onInputChange() {
    if (this.searchTerm.length > 0) {
      this.showMenu = true;
      // Call your user service to retrieve users based on searchTerm
      this.userService.searchUsers(this.searchTerm).subscribe(
        (results: any[]) => {
          this.searchResults = results;
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    } else {
      this.showMenu = false;
      this.searchResults = [];
    }
  }
}
