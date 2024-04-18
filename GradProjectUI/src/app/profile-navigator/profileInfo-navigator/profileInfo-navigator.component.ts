import { Component, Input, OnInit } from '@angular/core';
import { UserProfileModel } from '../../models/userProfile';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'profileInfoNavigator',
  templateUrl: './profileInfo-navigator.component.html',
  styleUrl: './profileInfo-navigator.component.scss'
})
export class ProfileInfoNavigator implements OnInit {
  @Input() userId: any; // Define userId as an input property

  user: UserProfileModel;
  users: UserProfileModel[] = [];

  constructor(private userService: UserService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getUserProfile(this.userId); // Retrieve user profile based on userId

    this.sharedService.profile$.subscribe((isInfoCreated) => {
      if (isInfoCreated) {
        this.getUserProfile(this.userId); // Update user profile when info is created
      }
    });
  }

  getUserProfile(userId: any): void {
    // Fetch user profile based on userId
    this.userService.getUserProfile(userId).subscribe((result) => {
      this.user = result;
    });
  }
}
