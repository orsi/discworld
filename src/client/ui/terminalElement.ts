import { EventChannel } from '../../common/services/eventChannel';
import { UIModule } from '../uiModule';
import { UIElement } from './uiElement';

export class TerminalElement extends UIElement {
  events: EventChannel;
  historyIndex = -1;
  history: string[] = [];
  value = '';

  constructor (ui: UIModule) {
    super('terminal', ui);

    // hook into input events
    this.events = ui.events;

    // style
    this.style.position = 'absolute';
    this.style.bottom = '0';
    this.style.left = '0';
    this.style.right = '0';
    this.style.height = '1em';
    this.style.lineHeight = '1em';
    this.style.fontFamily = 'Courier New';
    this.style.padding = '3px';
    this.style.whiteSpace = 'nowrap';
    this.style.outline = 'none';
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
      this.ui.onTerminalMessage(this.value);

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
