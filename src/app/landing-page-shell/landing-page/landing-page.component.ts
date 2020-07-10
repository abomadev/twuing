
import { Component, ViewChild, ElementRef } from '@angular/core';
// Remember to import BrowserAnimationsModule in app.module.ts
import { trigger, transition, style, animate } from '@angular/animations';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AuthService } from 'src/app/auth/auth.service';

interface MailChimpResponse {
  result: string;
  msg: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
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
export class LandingPageComponent {

  MAILCHIMP_ENPOINT = 'https://dev.us10.list-manage.com/subscribe/post-json?u=f78e2c921b78d0c9159185af8&amp;id=6951fb638f';
  subscriberEmail;
  error = ''
  submitted = false;

  show0 = false;
  show1 = false;

  form: FormGroup;

  @ViewChild('video', { static: true }) private videoRef: ElementRef;
  constructor(public auth: AuthService, private http: HttpClient, private fb: FormBuilder, private configurationService: ConfigurationService) { }


  ngOnInit() {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })

  }



  toggle0() {
    this.show0 = !this.show0;
  }
  showVideo() {
    this.configurationService.showVideo();
  }

  get email(){
    return this.form.get('email')
  }

  submit(){
    if(this.form.valid){
      console.log("Add", this.email.value)
    } else{
      console.log("Not Ready")
    }
  }

  addSubscriber() {
    this.error = '';
    if (this.form.valid) {

      const params = new HttpParams()
        .set('EMAIL', this.email.value)
        .set('b_f78e2c921b78d0c9159185af8_6951fb638f', ''); // hidden input name

      const mailChimpUrl = `${this.MAILCHIMP_ENPOINT}&${params.toString()}`;

      // 'c' refers to the jsonp callback param key. This is specific to Mailchimp
      this.http.jsonp<MailChimpResponse>(mailChimpUrl, 'c').subscribe(response => {
        if (response.result && response.result !== 'error') {
          this.submitted = true;
          this.form.reset();
        }
        else {
          this.error = response.msg;
        }
      }, error => {
        console.error(error);
        this.error = 'Sorry, an error occurred.';
      });
    }
  }
}

