import { Component, OnInit } from '@angular/core';
import { UserProfileModel } from '../models/userProfile';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {UserService} from "../services/user.service";
@Component({
  selector: 'profilePageNavigator',
  styleUrl: './profile-page-navigator.component.scss',
  templateUrl: './profile-page-navigator.component.html',
})
export class ProfilePageNavigator implements OnInit{
  user:UserProfileModel;
  users: UserProfileModel[] = [];
  userId: any;
  constructor(private route: ActivatedRoute,private  userService: UserService, private router:Router) {}
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
    this.userId = this.route.snapshot.paramMap.get('id');

    this.getUserById();
    this.getFriendsById();
    }
    getUserById() {
      this.userService.getUserById(this.userId).subscribe(
        (result: UserProfileModel) => {
          this.user = result;
        },
        (error) => {
          console.error('Error fetching user by id:', error);
        }
      );
    }
    getFriendsById() {
      debugger
      if (!this.userId) {
        console.error('Invalid userId provided.');
        return;
      }
      this.userService.getFriendsById(this.userId).subscribe(
        (result: UserProfileModel[]) => {
          this.users = result;
        },
        (error) => {
          console.error('Error fetching friends:', error);
        }
      );
    }
    navigateToUserProfile(userId: string): void {
      this.router.navigate(['/UserProfile', userId]);
    }


}
