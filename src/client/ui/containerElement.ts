import { ClientUI } from '../clientUI';
import { UIElement } from './uiElement';

export class ContainerElement extends UIElement {
  constructor (ui: ClientUI) {
    super('container');

    this.style.position = 'absolute';
  }
}
window.customElements.define('reverie-container', ContainerElement);
