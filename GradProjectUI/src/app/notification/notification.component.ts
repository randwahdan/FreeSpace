import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import {SharedService} from "../services/shared.service";
import {PostService} from "../services/post.service";
import {NotificationModel} from "../models/Notification-model";
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { formatDistanceToNow } from 'date-fns';
@Component({
  selector: 'notification-page',
  templateUrl: './notification.component.html',
  styleUrl:'./notification.component.scss'

})
export class NotificationPage implements OnInit {
  @Input() userId:any;
  user:UserModel;
  notificationsModels:NotificationModel[]=[];
  constructor(private router: Router, private sharedService: SharedService, private  postService :PostService,private toastr:ToastrService){
  }
  formatTimeAgo(createdDate: Date): string {
    return formatDistanceToNow(createdDate, { addSuffix: true });
  }
  ngOnInit(): void {
    this.getNotifications();
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
  }
  getNotifications() {
    this.postService.getNotifications().subscribe(async result => {
      this.notificationsModels = result
    });
  }
}
