import { Component,OnInit,ViewChild } from '@angular/core';
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
export class CreateEvent implements OnInit{
  eventForm: FormGroup;
  selectedFiles: File[] | null = null;
  user:UserModel;
  @ViewChild('fileInput') fileInputImage: any;

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
      category: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      link: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }
  ngOnInit(): void {
    let userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;
  }
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }
  onFileClick(event: Event): void {
    if (this.fileInputImage) {
      this.fileInputImage.click();
    }
  }

  EventCreation() {
    if (this.eventForm.invalid) {
      // If the form is invalid, mark all fields as touched to display validation errors
      this.eventForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
    }
    // Extract form values
    let formValue = this.eventForm.value;
    // Create a new EventModel instance
    const startDate = new Date(formValue.startDate);
    if (startDate <= new Date()) {
      this.toastr.error('Event Date must be in the future.');
      return;
    }
    // Check if endDate is after startDate
    const endDate = new Date(formValue.endDate);
    if (endDate <= startDate) {
      this.toastr.error('Event End Date Must Be After Start Date.');
      return;
    }

    let eventModel = new EventModel();

    eventModel.title = formValue.title;
    eventModel.description = formValue.description;
    eventModel.startDate = startDate;
    eventModel.endDate = endDate;
    eventModel.category = formValue.category;
    eventModel.country = formValue.country;
    eventModel.city = formValue.city;
    eventModel.link = formValue.link;
    // Create a new FormData object
    const formData: FormData = new FormData();

    // Append eventModel JSON string to FormData
    formData.append('eventModel', JSON.stringify(eventModel));

    // Append selected file to FormData
    if (this.selectedFiles != null) {
      for (let index = 0; index < this.selectedFiles.length; index++) {
        formData.append('files', this.selectedFiles[index], this.selectedFiles[index].name);
      }
    }
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
        // Show success toastr messag
        this.selectedFiles = null;
        if (this.fileInputImage) {
          this.fileInputImage.nativeElement.value = '';
        }
        this.toastr.success('Your Event was created successfully.');
      });
  }
}
