export class UIContainerElement extends HTMLElement {
  constructor () {
    super();
  }
}
window.customElements.define('reverie-ui', UIContainerElement);
