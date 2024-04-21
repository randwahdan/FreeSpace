import { Component, OnInit,Input, Output } from '@angular/core';
import { UserProfileModel } from '../../models/userProfile';
import {SharedService} from "../../services/shared.service";
import { UserService } from '../../services/user.service';
@Component({
  selector: 'profile-navigator-details',
  templateUrl: './profile-navigator-details.component.html',
})
export class ProfileNavigatorDetails implements OnInit{
  @Input() user: UserProfileModel | null = null; // Initialize user as null or with default values
  @Input() userId: any;

  constructor(private sharedService: SharedService,private  userService: UserService) {
  }
  ngOnInit(): void {
  }
}
