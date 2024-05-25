import {Component, OnInit, Input} from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user-model';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { FriendRequestModel } from '../../models/friend-request';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-friends-list',
  templateUrl: './friendsList.component.html',
  styleUrl:'./friendsList.component.scss'
})
export class FriendsComponent implements OnInit {
  user: UserModel;
  users: UserModel[] = [];

  constructor(private userService: UserService, private sharedService: SharedService,private router: Router ,private toastr:ToastrService , private dialog: MatDialog) { }
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
  removeFriend(userSourceId: string): void {
    const confirmationDialogData: ConfirmationDialogData = {
      title: 'Confirm Removal',
      message: 'Are you sure you want to remove this friend?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      height :'280px',
      data: confirmationDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed removal, proceed with removal logic
        const friendRequest: FriendRequestModel = {
          userSourceId: userSourceId,
          userTargetId: this.userId,
          status: 'Removed' // Optional: Specify additional status if needed
        };

        // Send request to UserService to remove friend
        this.userService.removeFriend(friendRequest).subscribe(
          (result) => {
            console.log('Friend removed successfully');
            this.toastr.success('Friend removed successfully');
            // Refresh friends list after removal
            this.getFriends();
          },
          (error) => {
            console.error('Error removing friend:', error);
            // Handle error (e.g., display error message)
          }
        );
      }
    });
  }

}

