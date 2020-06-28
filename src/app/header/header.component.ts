import { Component, OnInit, HostListener } from '@angular/core';
import { ParserService } from '../services/parser.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  pastedInput: string = '';

  constructor(private parserService: ParserService) { }

  ngOnInit() {
  }

  @HostListener('paste', ['$event'])
  onPaste(paste) {
    this.parserService.parse(paste.clipboardData.getData('text'))
    setTimeout(() => {
      this.pastedInput = "";
    }, 0);
 }
}
