import { Time } from "@angular/common";
import { MediModel } from "./Media";
export class EventModel {
    eventId !:any;
    title!: string;
    description!: string;
    country!: string;
    city!: string;
    category!: string;
    startDate!: Date;
    startTime!: Date; // Changed back to Date type
    endDate!: Date;
    endTime!: Date; // Changed back to Date type
    media:MediModel[];
    link!: string;
    firstName: string;
    lastName!: string;
    profilePicture!: string;
    fullName!: string;
    isAttend:boolean;
    attendanceNumber: number;
}
