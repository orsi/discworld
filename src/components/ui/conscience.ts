import Component from '../component';
import Thought from './thought';

export default class Conscience extends Component {
  constructor () {
    super();
  }
  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('thought-finished', (e: Event) => {
      console.log(e);
      (<CustomEvent>e).detail.remove();
    });
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
    this.shadow.appendChild(t);
  }
}
customElements.define('discworld-conscience', Conscience);
