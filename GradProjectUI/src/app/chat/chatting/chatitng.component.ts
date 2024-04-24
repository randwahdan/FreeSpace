import { Component, OnInit,Input} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../models/user-model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'chatting',
  templateUrl: './chatitng.component.html',
  styleUrl:'./chatitng.component.scss'
})
export class ChatingComponent implements OnInit {
  @Input() userId:any;
  users: UserModel[] = [];
  user: UserModel;

  constructor(private router: Router,private toastr:ToastrService,private userService:UserService){

  }
  ngOnInit(): void {
    let userStorge = localStorage.getItem('user');
    this.user = userStorge ? JSON.parse(userStorge) : null;
    this.getFriends();

  }
  getFriends() {
    this.userService.getFriends().subscribe(async result => {

      this.users = result

    });
  }
}

