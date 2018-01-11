import { Component } from './';
export class ConscienceComponent extends Component {
  thoughts: Thought[] = [];
  constructor () {
    super();
  }
  connectedCallback () {
    super.connectedCallback();
  }
  get template () {
    let html = `
      <style>
        div {
          position: absolute;
          bottom: 1.5em;
          left: 0;
          width: 600px;
          height: 300px;
          line-height: 1em;
          font-family: 'Courier New';
          padding: 3px;
          whitespace: nowrap;
          overflow: hidden;
        }
      </style>
    `;

    let string = '';
    for (let t of this.thoughts) {
      string += `<p>${t}</p>`;
    }
    return html + string;
  }
  print (text: string) {
    let thought = new Thought(text);
    this.shadow.appendChild(thought);
  }
}
customElements.define('reverie-conscience', ConscienceComponent);

class Thought extends HTMLElement {
  createdAt: number;
  constructor (public text: string) {
    super();
    this.createdAt = new Date().getTime();
    let p = document.createElement('p');
    let t = document.createTextNode(text);
    p.appendChild(t);
    this.appendChild(p);
    this.style.display = 'block';
    this.style.opacity = '1';
    requestAnimationFrame(() => this.run());
  }
  run() {
    let now = new Date().getTime();
    let delta = now - this.createdAt;
    this.style.opacity = (1 - (delta / 5000)).toString();
    if (now - this.createdAt < 5000) {
      requestAnimationFrame(() => this.run());
    } else {
      this.remove();
    }
  }
}
customElements.define('reverie-thought', Thought);