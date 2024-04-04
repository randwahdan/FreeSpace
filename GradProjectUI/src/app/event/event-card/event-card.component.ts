import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { EventService } from '../../services/event.service';
import { UserModel } from '../../models/user-model';
import { EventModel } from '../../models/Event.model';
import { ToastrService } from 'ngx-toastr';
import 'select2';
import { ResponseModel } from '../../models/Response.model';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCards implements OnInit, AfterViewInit {
  user: UserModel;
  eventModelList: EventModel[] = [];
  selectedCategory: string = 'all'; // Default selected category
  selectedCountry: string = 'all'; // Default selected country
  uniqueCountries: string[];
  uniqueCategories: string[]; // Array to hold unique categories
  endedEvents: EventModel[] = [];
  @ViewChild('categoryDropdown') categoryDropdown: ElementRef;
  @ViewChild('countryDropdown') countryDropdown: ElementRef;

  constructor(
    private eventService: EventService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
    this.getEvents();
  }

  ngAfterViewInit(): void {
    // Initialize Select2 after the view is initialized
    $(this.categoryDropdown.nativeElement).select2();
    $(this.countryDropdown.nativeElement).select2();
  }

  getEvents(): void {
    this.eventService.getEvents().subscribe((result: EventModel[]) => {
      const currentDate = new Date();
      const filteredEvents = result.filter((event: EventModel) => new Date(event.endDate) >= currentDate);

      this.eventModelList = filteredEvents;
      this.endedEvents = result.filter((event: EventModel) => new Date(event.endDate) < currentDate);

      // Get unique categories from ongoing/upcoming events
      const activeCategories: string[] = [];
      filteredEvents.forEach(event => {
        if (!activeCategories.includes(event.category)) {
          activeCategories.push(event.category);
        }
      });
      this.uniqueCategories = activeCategories;

      // Get unique countries from ongoing/upcoming events
      const activeCountries: string[] = [];
      filteredEvents.forEach(event => {
        if (!activeCountries.includes(event.country)) {
          activeCountries.push(event.country);
        }
      });
      this.uniqueCountries = activeCountries;

      console.log('Ongoing/Upcoming Events:', this.eventModelList);
      console.log('Ended Events:', this.endedEvents);
    });
  }
  filterByCategory() {
    if (this.selectedCategory === 'all') {
      // Handle filtering by all categories excluding archive events
      if (this.selectedCountry === 'all') {
        this.getEvents();
      } else {
        this.eventService.getEventsByCountry(this.selectedCountry).subscribe(result => {
          // Exclude archive events from the result
          this.eventModelList = result.filter(event => !this.isArchiveEvent(event));
        });
      }
    } else if (this.selectedCategory === 'archive') {
      // Handle filtering by archive events
      this.getArchiveEvents();
    } else {
      // Handle filtering by other categories and country
      if (this.selectedCountry === 'all') {
        // Filter by category only
        this.eventService.getEventByCategory(this.selectedCategory).subscribe(result => {
          // Exclude archive events from the result
          this.eventModelList = result.filter(event => !this.isArchiveEvent(event));
        });
      } else {
        // Filter by both category and country
        this.eventService.getEventsByCategoryAndCountry(this.selectedCategory, this.selectedCountry).subscribe(result => {
          // Exclude archive events from the result
          this.eventModelList = result.filter(event => !this.isArchiveEvent(event));
        });
      }
    }
  }


  filterByCountry() {
    if (this.selectedCountry === 'all') {
      // Handle filtering by all countries for the selected category
      if (this.selectedCategory === 'all') {
        this.getEvents();
      } else {
        // Filter by category only
        this.eventService.getEventByCategory(this.selectedCategory).subscribe(result => {
          // Exclude archive events from the result
          this.eventModelList = result.filter(event => !this.isArchiveEvent(event));
        });
      }
    } else {
      // Handle filtering by both category and country
      this.eventService.getEventsByCategoryAndCountry(this.selectedCategory, this.selectedCountry).subscribe(result => {
        // Exclude archive events from the result
        this.eventModelList = result.filter(event => !this.isArchiveEvent(event));
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

  makeResponse(event: any) {
    if (!event || !event.eventId) {
      console.error("Invalid event or eventId");
      return;
    }
    let responseModel = new ResponseModel();
    responseModel.eventId = event.eventId;
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

  makeDisResponse(event: any) {
    let responseModel = new ResponseModel();
    responseModel.eventId = event.eventId; // Assigning eventId to the ResponseModel instance
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
