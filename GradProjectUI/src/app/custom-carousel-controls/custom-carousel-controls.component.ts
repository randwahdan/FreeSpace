import { Component, Input } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custom-carousel-controls',
  templateUrl: './custom-carousel-controls.component.html',
  styleUrls: ['./custom-carousel-controls.component.scss']
})
export class CustomCarouselControlsComponent {
  @Input() carousel: NgbCarousel;

  prev() {
    if (this.carousel) {
      this.carousel.prev();
    }
  }

  next() {
    if (this.carousel) {
      this.carousel.next();
    }
  }
}
