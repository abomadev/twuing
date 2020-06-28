import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParserService } from '../services/parser.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnDestroy {

  htmlMarkdown;
  tsMarkdown;
  subscriptions: Subscription[] = [];

  show: 'tw' | 'html' | 'typescript' = 'typescript'
  constructor(private parserService: ParserService) { }

  ngOnInit() {
    this.subscriptions.push(this.parserService.parsedHtml.subscribe(text => this.htmlMarkdown = text));
    this.subscriptions.push(this.parserService.parsedTypescript.subscribe(text => this.tsMarkdown = text));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  setShow(type: 'tw' | 'html' | 'typescript') {
    this.show = type;
  }

  get showTw() {
    return this.show == 'tw'
  }

  get showTs() {
    return this.show == 'typescript'
  }

  get showHtml() {
    return this.show == 'html'
  }

  get copyString() {
    return this.show == 'typescript' ? this.tsMarkdown : this.htmlMarkdown;
  }
}
