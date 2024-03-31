import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/Event.model';
import { UserModel } from '../../models/user-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetails implements OnInit {
  @Input() eventId: string;
  eventModel: EventModel; // Assuming only one event is fetched
  user: UserModel;
  isDescriptionExpanded = false;
  isDescriptionLong = false; // Declare the property

  constructor(private eventService: EventService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['eventId'];
    this.fetchEventDetails();
    let userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
  }

  fetchEventDetails(): void {
    if (this.eventId) {
      this.eventService.getEventDetails(this.eventId).subscribe(
        (result: EventModel) => {
          this.eventModel = result;
          console.log('Event details:', this.eventModel);
          // Calculate description length and set isDescriptionLong
          this.isDescriptionLong = this.getDescriptionHeight() > 3;
        },
        (error: any) => {
          console.error('Error fetching event details:', error);
        }
      );
    } else {
      console.error('Event ID is not provided.');
    }
  }

  isVideo(media: any): boolean {
    return media && media.isVideo;
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  // Calculate the height of the description based on its content
  getDescriptionHeight(): number {
    const lineHeight = 16; // Assuming each line's height is 16 pixels
    // Calculate the height of the description based on its content
    return Math.ceil(this.eventModel.description.length / 40); // Assuming an average of 40 characters per line
  }
  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
