import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { EventService } from '../services/event.service';
import { UserModel } from '../models/user-model';
import { EventModel } from '../models/Event.model';
import { ResponseModel } from '../models/Response.model';
import { ToastrService } from 'ngx-toastr';
import 'select2';

@Component({
  selector: 'app-archive-event',
  templateUrl: './archive-event.component.html',
  styleUrl: './archive-event.component.scss'
})
export class ArchiveEventComponent implements OnInit {
  user: UserModel;
  archiveEvents: EventModel[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getArchiveEvents();
  }

  getArchiveEvents(): void {
    this.eventService.getArchiveEvents().subscribe(result => {
      this.archiveEvents = result;
    });
  }

}
