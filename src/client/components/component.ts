import { uuid } from '../../common/utils/uuid';
import { Point2D } from '../../common/data/point2d';
export class Component extends HTMLElement {
    serial: string;
    width: number;
    height: number;
    center: Point2D;
    shadow: ShadowRoot;
    constructor () {
        super();
    }
    connectedCallback () {
        this.serial = this.id = uuid();

        // Create a shadow root
        this.shadow = this.attachShadow({mode: 'open'});
    }
    render () {}
    resize (width: number, height: number) {
        this.width = width;
        this.height = height;
        this.style.width = width + 'px';
        this.style.height = height + 'px';
        this.center = new Point2D(width / 2, height / 2);
    }
}