import Component from '../component';

export default class Terminal extends Component {
  historyIndex = -1;
  history: string[] = [];
  _value = '';
  set value (val: string) {
    this._value = val;
    this.stateChange = true;
  }
  get value () { return this._value; }
  constructor () {
    super();
  }
  connectedCallback () {
    super.connectedCallback();
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }
  get template () {
    return `
    <style>
      :host {
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        line-height: 1em;
        font-family: 'Courier New';
        padding: 8px;
        whitespace: nowrap;
        overflow: hidden;
      }
    </style>
    <div>${this.value}</div>
    `;
  }
  onKeyDown (e: KeyboardEvent) {
    if (e.ctrlKey || e.altKey || e.metaKey) {
        // do command
    } else {
        this.onKey(e.key, e);
    }
    this.render();
  }
  onKeyUp (e: KeyboardEvent) {}

  onKey (key: string, e: KeyboardEvent) {
    if (key === 'ArrowUp') {
      this.prevHistory();
    }
    if (key === 'ArrowDown') {
      this.nextHistory();
    }
    if (key === 'Backspace') {
      e.preventDefault(); // prevents browser from leaving page
      this.value = this.value.slice(0, -1);
    }
    if (key === 'Enter') {
      this.submit();
    }
    if (key.length === 1 && this.value.length <= 100) {
      // limit of 100 characters
      this.value += key;
    }
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
      this.dispatchEvent(new CustomEvent('terminal-message', {
          detail: this.value
        })
      );

      this.value = '';
    }
  }
}
customElements.define('discworld-terminal', Terminal);
