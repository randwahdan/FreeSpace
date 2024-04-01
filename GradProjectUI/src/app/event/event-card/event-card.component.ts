import { Component,Input, OnInit,ViewChild  } from '@angular/core';
import { EventService } from '../../services/event.service';
import { UserModel } from '../../models/user-model';
import { Router } from '@angular/router';
import { EventModel } from '../../models/Event.model';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseModel } from '../../models/Response.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCards implements OnInit{
  user: UserModel;
  event:EventModel;
  eventModelList: EventModel[] = [];

  @Input() userId: any;
  @Input() eventId: any;

  constructor(
    private eventService: EventService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private toastr:ToastrService
  ){}
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
    this.getEvents();
  }

  getEvents() {
    this.eventService.getEvents().subscribe(result => {
      this.eventModelList = result;
      console.log(result);
    });
  }

  makeResponse(event: any) {
    if (!event || !event.eventId) {
      console.error("Invalid event or eventId");
      return;
    }
    let responseModel = new ResponseModel();
    responseModel.eventId =event.eventId;
    console.log(responseModel);
    this.eventService.makeResponse(responseModel).subscribe(result => {
      if (result == true) {
        event.isAttend = true;
        event.attendanceNumber += 1;
        this.toastr.success('Attendance confirmed.');
      } else {
        this.toastr.error('Failed to confirm attendance.'); 
      }
    });
}
makeDisResponse(event:any) {
  let responseModel = new ResponseModel();
   responseModel.eventId =event.eventId; // Assigning eventId to the ResponseModel instance
  // Now you can use responseModel for further processing
  console.log(responseModel);
  this.eventService.makeDisResponse(responseModel).subscribe(result => {
    if (result == true) {
      event.isAttend = false;
      event.attendanceNumber -= 1;
      this.toastr.success('Attendance cancelled.');
    } else {
      this.toastr.error('Failed to cancel attendance.');
    }
  });
}
}



