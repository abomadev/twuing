import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ParserService } from '../services/parser.service';
import { InstructionsService } from '../services/instructions.service';
import { AuthService } from '../auth/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [ 
    trigger('trigger0', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('200ms ease-out', style({  opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(.95)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  @ViewChild('results') resultsRef: ElementRef;

  html;
  ts;
  instructionsList;
  show: 'html' | 'typescript' = 'html'

  show0 = false;


  constructor(private parserService: ParserService, public instructionsService: InstructionsService, public auth: AuthService) { }


  ngOnInit() {
    this.html = this.parserService.parsedHtml.asObservable()
    this.ts = this.parserService.parsedTypescript.asObservable()
    this.instructionsList = this.instructionsService.instructionsList.asObservable()
  }

  @HostListener('paste', ['$event'])
  onPaste(paste) {
    // this.resultsRef.nativeElement.scrollIntoView();
 }

 toggle0(){
  this.show0 = !this.show0;
}
}
