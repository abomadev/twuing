import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarkdownService } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
import { AnimationsHandlerService } from './animations-handler.service';
import { InstructionsService } from './instructions.service';


@Injectable({
  providedIn: 'root'
})
export class ParserService {

  htmlInit = `
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <!-- Content goes here -->
    </div>
  </div>`

  tsInit = `
  import { Component } from '@angular/core';

  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
  })
  export class AppComponent {
    title = 'twuing';
  }`

  parsedHtml: BehaviorSubject<string> = new BehaviorSubject<string>(this.htmlInit);
  parsedTypescript: BehaviorSubject<string> = new BehaviorSubject<string>(this.tsInit);
  parsedTw: BehaviorSubject<string> = new BehaviorSubject<string>(this.htmlInit);


  // RegEx expressions
  reComment = /((?=<!--)([\s\S]*?)-->)/m
  reShowHide = /(show\/hide)/m
  reOnOff = /On:(.*)Off:(.*)/g
  reAnimation = /(Entering:[^]*From:[^]*To:[^]*Leaving:[^]*From:[^]*To:[^]*")/m

  animations = '';
  imports = `import { Component } from '@angular/core';
`;
  componentVariables= ''
  componentFunctions = ''

  tailwindCheatSheet;

  // this id will be used to relate variables, animation triggers and trigger functions
  uniqueId = 0;


  constructor(
    private animationsService: AnimationsHandlerService,
    private instructionsService: InstructionsService
    ) {
  }

  parse(text?: string) {
    // reset handlers
    this.reset()
    this.animationsService.reset()
    this.instructionsService.reset()

    let tempText = text;
    let resultHtml = ''
    while (true) {
      const commentMatch = tempText.match(this.reComment)

      if (!commentMatch) {
        resultHtml += tempText
        break;
      }
      const commentText = commentMatch[1]

      // do some processing
      const triggerAnimation = this.processComment(commentText)

      resultHtml += tempText.substr(0, commentMatch.index + commentMatch[0].length)
      tempText = tempText.substr(commentMatch.index + commentMatch[0].length)

      // insert trigger
      if (triggerAnimation) {
        const insertPointMatch = tempText.match(/[<]\S{1,}\s/m)
        tempText = tempText.substr(0, insertPointMatch.index + insertPointMatch[0].length) + `@${triggerAnimation.trigger} *ngIf='${triggerAnimation.condition}' ` + tempText.substr(insertPointMatch.index + insertPointMatch[0].length)
        this.uniqueId += 1
      }
    }

    this.parsedHtml.next(resultHtml)


    const ts = `
    ${this.tsImports()}
    ${this.tsComponentHeader()}
    ${this.tsComponentClass()}
    `
    this.parsedTypescript.next(ts);
  }

  processComment(comment: string) {
    const toggleMatch = comment.match(this.reShowHide)
    const toggleWithAnimationMatch = comment.match(this.reAnimation)
    const onOffMatch = comment.match(this.reOnOff)

    // Show/Hide with Animation
    if (toggleMatch && toggleWithAnimationMatch) {
      console.log("ANIMATION", toggleWithAnimationMatch)

      // Add animations imports
      if (!this.imports.includes(`import { trigger, transition, style, animate } from '@angular/animations';`)) { 
        this.imports += `
    import { trigger, transition, style, animate } from '@angular/animations';`;
      // Add instruction on how to trigger animation
      this.instructionsService.add({
        description: `Add BrowserAnimationsModule to the imports array of app.module.ts`
      })
        // Remember to import BrowserAnimationsModule in app.module.ts
      }
      // Creates an animation and returns trigger
      const trigger = this.animationsService.addTsAnimation(toggleWithAnimationMatch[0], this.uniqueId)

      // Add toggle function
      this.componentVariables += `
      show${this.uniqueId} = false;`

      this.componentFunctions += `
      toggle${this.uniqueId}(){
        this.show${this.uniqueId} = !this.show${this.uniqueId};
      }`

      // Add instruction on how to trigger animation
      this.instructionsService.add({
        description: `Add to where ever you want to trigger ${trigger}`,
        markdown: `(click)="toggle${this.uniqueId}()"`
      })
      return {trigger: trigger, condition: `show${this.uniqueId}`}

    } else if (!toggleMatch && toggleWithAnimationMatch) {
      console.log("OTHER ANIMATION", comment)

    } else if (toggleMatch && !toggleWithAnimationMatch) {
      console.log("SHOW HIDE", comment)

    } else if (onOffMatch) {
      console.log("ON OFF", comment, onOffMatch.length)

    } else {
      console.log("UNKNOWN", comment)
    }
    return null
  }

  reset(){
    this.uniqueId = 0;
    this.animations = '';
    this.imports = `import { Component } from '@angular/core';`;
    this.componentVariables= ''
    this.componentFunctions = ''
  }

  tsAnimations() {
    return `,
      animations: [ ${this.animationsService.tsAnimations}
      ]`
  }

  tsImports() {
    return this.imports
  }

  tsComponentHeader() {
    return `
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html'${this.tsAnimations()}
    })`
  }

  tsComponentClass() {
    return `export class AppComponent {
      ${this.componentVariables}
      ${this.componentFunctions}
    }
    `
  }
}
