import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  showModal: Subject<boolean> = new Subject<boolean>()

  constructor() { 
  }
  
  showVideo(){
    this.showModal.next(true)
  }
}
