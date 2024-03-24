import { Component, OnInit,Input} from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'chatting',
  templateUrl: './chatitng.component.html',
  styleUrl:'./chatitng.component.scss'
})
export class ChatingComponent implements OnInit {
  @Input() userId:any;

  constructor(private router: Router,private toastr:ToastrService){

  }
  ngOnInit(): void {

  }
}

