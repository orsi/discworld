import { uuid } from '../../common/utils/uuid';
import { Point } from '../../common/data/point';
import { Viewport } from '../viewport';
export class Component extends HTMLElement {
    serial: string;
    width: number;
    height: number;
    center: Point;
    shadow: ShadowRoot;
    constructor () {
        super();
    }
    connectedCallback () {
        this.serial = this.id = uuid();

        // Create a shadow root
        this.shadow = this.attachShadow({mode: 'open'});
    }
    render (viewport: Viewport) {}
    resize (width: number, height: number) {
        this.width = width;
        this.height = height;
        this.style.width = width + 'px';
        this.style.height = height + 'px';
        this.center = new Point(width / 2, height / 2);
    }
}