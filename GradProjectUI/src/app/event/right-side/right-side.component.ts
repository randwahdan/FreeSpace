import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder,FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EventModel } from '../../models/Event.model';
@Component({
  selector: 'right-side',
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.scss'
})
export class RightSide {
  eventForm: FormGroup;
  EventModel:EventModel=new EventModel();

  constructor( private router: Router, private authService: AuthService, private fb: FormBuilder){
     // Initialize the form in the constructor
     this.eventForm = this.fb.group({
      title: '',
      description:'',
      place:'',
      category:'',
      startDate:'',
      startTime:'',
      endDate:'',
      endTime:'',
      file:''
    });

  }
EventCreation(){
  this.EventModel.title = "";
  this.EventModel.description = "";
  this.EventModel.place = "";
  this.EventModel.category = "";
  this.EventModel.startDate=new Date();
  this.EventModel.startTime=new TimeRanges();
  this.EventModel.endDate=new Date();
  this.EventModel.endTime=new TimeRanges();
  this.authService.EventCreation(this.EventModel).subscribe(res => {
    localStorage.setItem('jwt', res.token);
    this.router.navigateByUrl('Event');
  });
   }
}