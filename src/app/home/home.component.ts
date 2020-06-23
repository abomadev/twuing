import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  @HostListener('paste', ['$event'])
  onPaste(paste) {
    console.log('PASTE OCCURED', paste, paste.clipboardData.getData('text'));
    this.router.navigate(['/result'])
 }

}
