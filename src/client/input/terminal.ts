import { EventManager } from '../EventManager';

export class Terminal {
  element: HTMLInputElement;
  historyIndex = -1;
  history: string[];
  events: EventManager;
  constructor (el: HTMLInputElement, events: EventManager) {
    this.element = el;

    // hook into input events
    this.events = events;
  }
  focus () {
    if (this.element) this.element.focus();
  }
  prevHistory () {
    if (this.history.length > 0 && this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      if (this.element) this.element.value = this.history[this.historyIndex];
    }
  }
  nextHistory  () {
    if (this.history.length > 0 && this.historyIndex > -1) {
      this.historyIndex--;
      if (this.historyIndex === -1) {
        this.element.value = '';
      } else {
        this.element.value = this.history[this.historyIndex];
      }

      // set caret at the end of line
      // strange hack for chrome
      setTimeout(() => { this.element.value = this.element.value; }, 0);
    }
  }
  submit () {
    const input = this.element.value;

    // check if input is not empty
    if (input !== '') {
      // update terminal history if it's not the same
      // as last input
      if (this.history[0] !== input) {
        this.history.unshift(input);
      }
      // console.log(terminalHistory, historyIndex);
      this.historyIndex = -1;
      console.log(input);
      this.events.emit('message', input);

      // reset input
      this.element.value = '';
    }
  }
}
