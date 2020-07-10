import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Instruction{
  id?: number;
  title?: string;
  description: string;
  markdown?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {

  instructions: Instruction[] = [];
  counter: number = 0;

  instructionsList: BehaviorSubject<Instruction[]> = new BehaviorSubject<Instruction[]>(null)
  constructor() { }

  add(i: Instruction){
    this.counter +=1
    this.instructions.push({...i, id: this.counter})
    this.instructionsList.next(this.instructions)
  }

  getInstructions(){
    return this.instructions;
  }

  reset(){
    this.counter = 0;
    this.instructions = []
    this.instructionsList.next(null)
  }
}
