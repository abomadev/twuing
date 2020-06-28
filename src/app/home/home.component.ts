import { Component, HostListener, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ParserService } from '../services/parser.service';
import { InstructionsService } from '../services/instructions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('results') resultsRef: ElementRef;

  html;
  ts;
  instructionsList;
  show: 'html' | 'typescript' = 'html'
  constructor(private parserService: ParserService, public instructionsService: InstructionsService) { }


  ngOnInit() {
    this.html = this.parserService.parsedHtml.asObservable()
    this.ts = this.parserService.parsedTypescript.asObservable()
    this.instructionsList = this.instructionsService.instructionsList.asObservable()
  }

  @HostListener('paste', ['$event'])
  onPaste(paste) {
    this.resultsRef.nativeElement.scrollIntoView();
 }
}
