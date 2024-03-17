import { Component, OnInit,Input} from '@angular/core';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrl:'./friend-list.component.scss'
})
export class FriendsListComponent implements OnInit {
  @Input() userId:any;
  user:UserModel;
  constructor(private router: Router,private toastr:ToastrService){

  }
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
  }
}
