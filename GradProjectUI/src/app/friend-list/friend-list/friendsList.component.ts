import {Component, OnInit, Input} from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-model';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friendsList.component.html',
  styleUrl:'./friendsList.component.scss'
})
export class FriendsComponent implements OnInit {
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
  @Input() userId: any;
  navigateToUserProfile(userId: string): void {
    this.router.navigate(['/UserProfile', userId]);
  }
}
