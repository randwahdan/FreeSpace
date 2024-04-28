import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import {SharedService} from "../services/shared.service";
import {PostService} from "../services/post.service";
import {NotificationModel} from "../models/Notification-model";
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfileModel } from '../models/userProfile';
import { UserService } from '../services/user.service';
@Component({
  selector: 'side-navigation-bar',
  templateUrl: './side-navigation-bar.component.html',
  styleUrl:'./side-navigation-bar.component.scss'

})
export class SideBarComponent implements OnInit {
  @Input() userId:any;
  hideActionMenu=false;
  hideActionMenu2: boolean = true;
  user:UserModel;
  notificationsModels:NotificationModel[]=[];
  searchTerm: string = '';
  showMenu: boolean = false;
  searchResults: any[] = [];
  users: UserProfileModel[] = [];

  constructor(private router: Router, private sharedService: SharedService, private  postService :PostService,private toastr:ToastrService,private userService :UserService){

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
    this.toastr.success("GoodBye");
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


  onSubmit(): void {
    if (this.searchTerm.trim() !== '') {
      this.userService.searchUsers(this.searchTerm).subscribe((users) => {
        this.users = users; // Update users array with search results
        this.hideActionMenu2 = false; // Show user toggle menu
      });
    } else {
      this.users = []; // Reset users array
      this.hideActionMenu2 = true; // Hide user toggle menu
    }
  }
  navigateToUserProfile(userId: string): void {
    this.router.navigate(['/UserProfile', userId]);
  }
}
