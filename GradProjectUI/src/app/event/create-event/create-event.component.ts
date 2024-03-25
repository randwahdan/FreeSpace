import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/Event.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environment";
import {SharedService} from "../../services/shared.service";
import { UserModel } from '../../models/user-model';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEvent {
  eventForm: FormGroup;
  selectedFile: File;
  user:UserModel;
  constructor(
    private router: Router,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      category: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      link: ['', [Validators.required, Validators.pattern('https?://.+')]],
      file: [null, Validators.required]
    });
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }
  EventCreation() {
    // Extract form values
    const formValue = this.eventForm.value;

    // Create a new EventModel instance
    const eventModel = new EventModel();
    eventModel.title = formValue.title;
    eventModel.description = formValue.description;
    eventModel.startDate = formValue.startDate;
    eventModel.endDate = formValue.endDate;
    eventModel.startTime = formValue.startTime;
    eventModel.endTime = formValue.endTime;
    eventModel.category = formValue.category;
    eventModel.country = formValue.country;
    eventModel.city = formValue.city;
    eventModel.link = formValue.link;

    // Create a new FormData object
    const formData: FormData = new FormData();

    // Append eventModel JSON string to FormData
    formData.append('eventModel', JSON.stringify(eventModel));

    // Append selected file to FormData
    formData.append('file', this.selectedFile, this.selectedFile.name); // Append file with its name

    // Send POST request to server
    this.http.post(`/Event/create-event`, formData)
      .pipe(
        catchError(error => {
          console.error('Error creating event:', error);
          let errorMessage = 'An error occurred while creating the event.';
          if (error.status === 400) {
            errorMessage = error.error; // Assuming the error message is sent in the response body
          }
          return throwError(errorMessage);
        })
      )
      .subscribe(async result => {
        // Reset form values
        this.eventForm.reset();

        // Show success toastr message
        this.toastr.success('Your Event was created successfully.');

        // Navigate to the Event page
        this.router.navigateByUrl('Event');
      });
  }





}
