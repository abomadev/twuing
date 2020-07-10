import { Component } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, private analytics: AngularFireAnalytics) {
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd ) => {
        this.logPageView(event.urlAfterRedirects)
      })
  }

  logPageView(page) {
    this.analytics.logEvent('custom_page_view', { page_path: page });
  }
}
