import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { EventModel } from "../models/Event.model";
import { ResponseModel } from '../models/Response.model';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) {}

  EventCreation(eventData: any): Observable<any> {
    return this.httpClient.post('/Event/create-event', eventData);
  }
  getEvents(): Observable<any> {
    return this.httpClient.get('/Event/get-events');
  }
  getEventDetails(eventId: string): Observable<EventModel> {
    return this.httpClient.get<EventModel>(`/Event/event-details/${eventId}`);
  }
  makeResponse(EventModel:any):Observable<any>{
    debugger
    return this.httpClient.post('/Event/make-response',EventModel);
      }
  makeDisResponse(EventModel:any):Observable<any>{
    debugger
        return this.httpClient.post('/Event/make-disResponse',EventModel);
          }
}
