import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AnimationDef {
  trigger: string;
  animation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnimationsHandlerService {

  private typescript = ''

  tailwindCheatSheet;

  constructor(private http: HttpClient) {
    this.http
      .get("/assets/tailwind-cheat-sheat.json")
      .subscribe(data => this.tailwindCheatSheet = data);
  }

  reset() {
    this.typescript = ''
  }

// transitions are called state change expressions

  private createAnimationString(str: string, id: number) {

    // 1 - Create trigger name
    const triggerName = `trigger${id}`

    // const reDuration = /duration-\d{2,3}/g
    // const durations = str.match(reDuration)
    // durations.forEach((dur: string) => {
    //   const dms = `${dur.replace('duration-', '')}ms`
    //   str = str.replace(dur, dms)
    // })

    // 2 - Separate enter and leave animation definitions
    const enterLeave = str.split("Leaving:")
    const enterDef = enterLeave[0]
    const leaveDef = "Leaving:" + enterLeave[1]

    // 3 - Get the enter and leave lines and string pre text
    const enterRow = enterDef.match(/Entering:\s.*"/g)[0].replace("Entering: ", "")
    const leaveRow = leaveDef.match(/Leaving:\s.*"/g)[0].replace("Leaving: ", "")

    // 4 - Prune any unwanted properties and convert into Angular animation format 
    const finalEnterAnimation = this.formatAnimationTimings(enterRow)
    const finalLeaveAnimation = this.formatAnimationTimings(leaveRow)

    // 5 - The inital state of the animation on entering and the final state after leaving
    const fromState = enterDef.match(/From:\s.*"/g)[0].replace("From: ", "").replace(/['"]+/g, '')
    let fromStyles = ''
    fromState.split(' ').forEach(style => {
      // Not sure how to handle breakpoint animations. i.e. sm:...
      if (style && !style.includes(":") && style !== 'transform') { fromStyles += ` ${this.toNgAnimation(style)},` }
    });

    // 6 - The final state of the animation on entering and the initial state after leaving
    const toState = enterDef.match(/To:\s.*"/g)[0].replace("To: ", "").replace(/['"]+/g, '')
    let toStyles = ''
    toState.split(' ').forEach(style => {
      // Not sure how to handle breakpoint animations. i.e. sm:...
      if (style && !style.includes(":") && style !== 'transform') { toStyles += ` ${this.toNgAnimation(style)},` }
    });

    // Remove trailing comma
    const fromStyle = fromStyles.slice(0, -1)
    const toStyle = toStyles.slice(0, -1)

    const animationStr = `
        trigger('${triggerName}', [
          transition(':enter', [
            style({${fromStyle} }),
            animate('${finalEnterAnimation}', style({ ${toStyle} }))
          ]),
          transition(':leave', [
            style({${toStyle} }),
            animate('${finalLeaveAnimation}', style({${fromStyle} }))
          ])
        ]),`

    return { trigger: triggerName, animation: animationStr } as AnimationDef
  }

  addTsAnimation(str: string, id: number) {
    const newAnimation: AnimationDef = this.createAnimationString(str, id)
    this.typescript += `${newAnimation.animation}`
    return newAnimation.trigger
  }

  get tsAnimations() {
    return this.typescript.slice(0, -1); // remove trailing comma
  }

  toNgAnimation(str: string) {
    if (str.match(/bg-(\S*?)-\d{1,3}/g)) {
      // background colour
      const val = this.getTwValue(str)
      return `backgroundColor: '${val}'`
    } else if (str.match(/scale-\d{1,3}/g)) {
      const val = this.getTwValue(str)
      return `transform: 'scale(${val})'`
    } else if (str.match(/scale-x-\d{1,3}/g)) {
      const val = this.getTwValue(str)
      return `transform: 'scaleX(${val})'`
    } else if (str.match(/scale-y-\d{1,3}/g)) {
      const val = this.getTwValue(str)
      return `transform: 'scaleY(${val})'`
    } else if (str.match(/rotate-\d{1,3}/g)) {
      const val = this.getTwValue(str)
      return `transform: 'rotate(${val})'`
    } else if (str.match(/translate-x-(\d{1,3}|\S*)/g)) {
      const val = this.getTwValue(str)
      return `transform: 'translateX(${val})'`
    } else if (str.match(/translate-y-(\d{1,3}|\S*)/g)) {
      const val = this.getTwValue(str)
      return `transform: 'translateY(${val})'`
    } else if (str === 'transform') {
      return "transform: 'translateX(0) translateY(0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)'"
    } else {
      return `${this.tailwindCheatSheet[str].replace(";", "")}`
    }

  }

  getTwValue(str) {
    return this.tailwindCheatSheet[str].match(/:\s(\S*|.*);/g)[0].replace(":", "").replace(" ", "").replace(";", "")
  }

  prune(str, arr: string[]) {
    console.log(str, arr)
    arr.forEach(element => {
      console.log(str)
      str = str.replace(element, "")
      // str = str.replace(new RegExp(`\b(element)\S+`, 'gi'))
    });
    return str
  }

  removeQuotes(str) {
    return str.replace(/['"]+/g, '')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
  }

  formatAnimationTimings(str: string){
    let result = '';
    // const unwanted = ['transition-opacity', 'transition', 'translate', 'transform']
    let duration = str.match(/duration-\d{1,3}/g)
    let delay = str.match(/delay-\d{1,3}/g)
    let easing = str.match(/ease-\S{1,}/g)
    
    // animation timings for angular have to be in this format: "duration [delay][easing]"
    if(duration){ result += `${this.getTwValue(duration[0])} `}
    if(delay){ result += `${this.getTwValue(delay[0])} `}
    // Value is one of ease, ease-in, ease-out, ease-in-out, or a cubic-bezier()
    if(easing){ result += this.removeQuotes(easing[0]) ==='ease-linear' ? 'ease' : this.removeQuotes(easing[0])}

    return result;
  }
}