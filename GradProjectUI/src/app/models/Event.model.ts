import { Time } from "@angular/common";

export class EventModel {
    title!: string;
    description!: string;
    country!: string;
    city!: string;
    category!: string;
    startDate!: Date;
    startTime!: Date; // Changed back to Date type
    endDate!: Date;
    endTime!: Date; // Changed back to Date type
    file!: File;
    link!: string;
}
