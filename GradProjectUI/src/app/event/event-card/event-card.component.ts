import { Component,Input, OnInit,ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { EventService } from '../../services/event.service';
import { UserModel } from '../../models/user-model';
import { Router } from '@angular/router';
import { EventModel } from '../../models/Event.model';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseModel } from '../../models/Response.model';
import { ToastrService } from 'ngx-toastr';
import 'select2';
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
  selectedCategory: string = 'all'; // Default selected category
  uniqueCategories: string[]; // Array to hold unique categories
  filteredEvents: any[]; // Array to hold filtered events
  ongoingEvents: EventModel[] = [];
  endedEvents: EventModel[] = [];
  hoverOption: string | null = null;
  @ViewChild('categoryDropdown') categoryDropdown: ElementRef;
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
    $(this.categoryDropdown.nativeElement).select2();
  }
  ngAfterViewInit(): void {
    // Reinitialize Select2 after the view is initialized
    $(this.categoryDropdown.nativeElement).select2();
  }
  getEvents() {
    this.eventService.getEvents().subscribe((result: EventModel[]) => {
      const currentDate = new Date();
      this.eventModelList = result.filter((event: EventModel) => new Date(event.endDate) >= currentDate);
      this.endedEvents = result.filter((event: EventModel) => new Date(event.endDate) < currentDate);

      // Get unique categories from ongoing/upcoming events
      const activeCategories: string[] = [];
      this.eventModelList.forEach(event => {
        if (!activeCategories.includes(event.category)) {
          activeCategories.push(event.category);
        }
      });
      this.uniqueCategories = activeCategories;

      console.log('Ongoing/Upcoming Events:', this.eventModelList);
      console.log('Ended Events:', this.endedEvents);
    });
  }



  getUniqueCategories(events: EventModel[]): string[] {
    const activeCategories: string[] = [];
    events.forEach(event => {
      if (!activeCategories.includes(event.category)) {
        activeCategories.push(event.category);
      }
    });
    return activeCategories;
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
filterByCategory() {
  if (this.selectedCategory === 'archive') {
    // Handle archive events
    this.getArchiveEvents();
  } else {
    // Handle filtering by other categories
    this.eventService.getEventByCategory(this.selectedCategory).subscribe(result => {
      this.eventModelList = result;
      // Reset other necessary variables or perform additional logic
    });
  }
}

getArchiveEvents() {
  this.eventService.getArchiveEvents().subscribe(result => {
    this.eventModelList = result;
  });
}
isArchiveEvent(event: EventModel): boolean {
  return new Date(event.endDate) < new Date();
}
}



