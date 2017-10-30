import { EventManager } from '../eventManager';

export class TerminalElement extends HTMLElement {
  events: EventManager;
  historyIndex = -1;
  history: string[] = [];
  value = '';

  constructor (events: EventManager) {
    super();

    // hook into input events
    this.events = events;

    // style
    this.style.lineHeight = '1em';
    this.style.fontFamily = 'Courier New';
    this.style.padding = '3px';
    this.style.whiteSpace = 'nowrap';
    this.style.outline = 'none';

    // grab all keyboard down events and process pressed key
    events.on('keyboard/down', (e: KeyboardEvent) => this.onKey(e.key));
  }

  onKey (key: string) {
    if (key === 'ArrowUp') {
      this.prevHistory();
    }
    if (key === 'ArrowDown') {
      this.nextHistory();
    }
    if (key === 'Backspace') {
      this.value = this.value.slice(0, -1);
    }
    if (key === 'Enter') {
      this.submit();
    }
    if (key.length === 1 && this.value.length <= 100) {
      // limit of 100 characters
      this.value += key;
    }

    this.update();
  }
  prevHistory () {
    if (this.history.length > 0 && this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.value = this.history[this.historyIndex];
    }
  }
  nextHistory  () {
    if (this.history.length > 0 && this.historyIndex > -1) {
      this.historyIndex--;
      if (this.historyIndex === -1) {
        this.value = '';
      } else {
        this.value = this.history[this.historyIndex];
      }
    }
  }
  submit () {
    // check if input is not empty
    if (this.value !== '') {
      // update terminal history if it's not the same
      // as last input
      if (this.history[0] !== this.value) {
        this.history.unshift(this.value);
      }
      // history should old be 10 items long
      if (this.history.length > 10) {
        this.history.pop();
      }
      this.historyIndex = -1;

      // emit message event
      this.events.emit('message', this.value);

      // reset value
      this.reset();
    }
  }
  reset () {
    this.value = '';
    this.update();
  }
  update() {
    // update input to reflect value
    if (this.innerHTML !== this.value) {
      this.innerHTML = this.value;
    }
  }
}
window.customElements.define('reverie-terminal', TerminalElement);
