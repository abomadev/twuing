import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ConfigurationService } from '../services/configuration.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-landing-page-shell',
  templateUrl: './landing-page-shell.component.html',
  animations: [
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
export class LandingPageShellComponent implements OnInit {

  show1 = false;

  subscriptions: Subscription[] = []
  constructor(private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.configurationService.showModal.subscribe(show => this.show1 = show));
  }

  toggle1() {
    this.show1 = !this.show1;
    // if (this.show1) { this.videoRef.nativeElement.playbackRate = 3; }
  }

}
