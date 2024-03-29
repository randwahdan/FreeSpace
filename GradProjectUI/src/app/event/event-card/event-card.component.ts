import { Component,Input, OnInit,ViewChild  } from '@angular/core';
import { EventService } from '../../services/event.service';
import { UserModel } from '../../models/user-model';
import { Router } from '@angular/router';
import { EventModel } from '../../models/Event.model';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCards implements OnInit{
  user: UserModel;
  event: EventModel;
  eventModelList: EventModel[] = [];

  @Input() userId: any;
  constructor(
    private eventService: EventService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ){}
  ngOnInit(): void {
    let userStorge=localStorage.getItem('user');
    this.user  = userStorge ? JSON.parse(userStorge) : null;
    this.getEvents();
  }
  isVideo(media: any): boolean {
    return media && media.isVideo; // Assuming that 'isVideo' property indicates if the media is a video
  }
  getEvents() {
    this.eventService.getEvents().subscribe(result => {
      this.eventModelList = result;
      this.eventModelList.forEach(event => {
        event.media.forEach(media => {
          media.isVideo = this.isVideo(media); // Set the 'isVideo' property for each media item
        });
      });
      console.log(result);
    });
  }

}



