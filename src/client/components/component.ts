import { uuid } from '../../common/utils/uuid';
export default class Component extends HTMLElement {
    serial: string;
    stateChange: boolean = false;
    disposing: boolean = false;
    width: number;
    height: number;
    shadow: ShadowRoot;
    constructor () {
        super();
        this.serial = this.id = uuid();

        // Create a shadow root
        this.shadow = this.attachShadow({mode: 'open'});
    }
    connectedCallback () {
        // attach template to component
        this.shadow.innerHTML = this.template;
    }
    disconnectedCallback () {
        console.log('being removed!');
    }
    /**
     * CSS, HTML template for custom element.
     */
    get template() {
        return ``;
    }
    /**
     * Renders any changes to custom element
     * if its state has changed.
     */
    render () {
        if (this.stateChange) {
            this.shadow.innerHTML = this.template;
            this.stateChange = false;
        }
    }
    fadeIn() {
        if (this.disposing) return;
        if (!this.style.opacity) this.style.opacity = '0';
        let opacity = parseFloat(this.style.opacity);
        if (opacity < 1) {
            this.style.opacity = '' + (opacity + .1);
            requestAnimationFrame(() => this.fadeIn());
        } else {
            this.style.opacity = '1';
        }
    }
    fadeOut() {
        this.disposing = true;
        if (!this.style.opacity) this.style.opacity = '1';
        let opacity = parseFloat(this.style.opacity);
        if (opacity >= 0) {
            this.style.opacity = '' + (opacity - .1);
            requestAnimationFrame(() => this.fadeOut());
        } else {
            this.remove();
            this.disposing = false;
        }
    }
    resize (width: number, height: number) {
        this.width = width;
        this.height = height;
        this.style.width = width + 'px';
        this.style.height = height + 'px';
    }
}