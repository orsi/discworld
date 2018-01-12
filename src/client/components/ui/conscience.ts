import { Component } from '../component';
import { Thought } from './thought';

export class Conscience extends Component {
  constructor () {
    super();
  }
  connectedCallback () {
    super.connectedCallback();
  }
  get template () {
    let html = `
      <style>
        :host {
          display: block;
          position: absolute;
          bottom: 1.5em;
          left: 0;
          font-family: "Courier New";
        }
      </style>
    `;
    return html;
  }
  print (text: string) {
    let t = new Thought(text);
    t.addEventListener('thought-finished', (e: Event) => {
      (<Component>e.target).remove();
    });
    this.shadow.appendChild(t);
  }
}
customElements.define('reverie-conscience', Conscience);
