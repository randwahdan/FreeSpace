import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../../models/user-model';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'profileInfo',
  templateUrl: './profileInfo.component.html',
  styleUrl: '././profileInfo.component.scss'
})
export class ProfileInfo implements OnInit {
  user: UserModel;
  users: UserModel[] = [];
  constructor(private userService: UserService, private sharedService: SharedService,private router: Router) { }
  ngOnInit(): void {
    let userStorge = localStorage.getItem('user');
    this.user = userStorge ? JSON.parse(userStorge) : null;
    this.getFriends();

    this.sharedService.profile$.subscribe((isInfoCreated) => {
      if (isInfoCreated) {
        let userStorge = localStorage.getItem('user');
        this.user = userStorge ? JSON.parse(userStorge) : null;
      }
    });

  }

  getFriends() {
    this.userService.getFriends().subscribe(async result => {
      this.users = result
    });
  }
  navigateToUserProfile(userId: string): void {
    this.router.navigate(['/UserProfile', userId]);
  }
  @Input() userId: any;

}
