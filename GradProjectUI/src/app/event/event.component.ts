import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class Event implements OnInit {


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Example: Fetch eventId from route parameters
  }
}
