import { UIModule } from '../uiModule';
import { UIElement } from './uiElement';

export class ContainerElement extends UIElement {
  constructor (ui: UIModule) {
    super('container', ui);

    this.style.position = 'absolute';
  }
}
window.customElements.define('reverie-container', ContainerElement);
