
import { Component, ViewChild, ElementRef } from '@angular/core';
// Remember to import BrowserAnimationsModule in app.module.ts
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  animations: [
    trigger('trigger0', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('150ms ease-out')
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'scale(.95)' }))
      ])
    ]),
    trigger('trigger1', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('trigger2', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(1rem)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(1rem)' }))
      ])
    ])
  ]
})
export class LandingPageComponent {

  @ViewChild('video', { static: true }) private videoRef: ElementRef;
  constructor() { }

  ngOnInit() {

  }

  show0 = false;
  show1 = false;

  toggle0() {
    this.show0 = !this.show0;
  }
  toggle1() {
    this.show1 = !this.show1;
    // if (this.show1) { this.videoRef.nativeElement.playbackRate = 3; }
  }
}

