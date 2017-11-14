import { uuid } from '../../../common/utils/uuid';

export class UIElement extends HTMLElement {
    x = 0;
    y = 0;
    width: number;
    height: number;
    serial: string;
    constructor (name: string) {
        super();
        this.serial = uuid();
        this.id = this.serial;
    }
    hasPoint (x: number, y: number) {
        let hasPoint = false;
        // within width and height coordinates
        if (x > this.x && x < this.x + this.width
            && y > this.y && y < this.y + this.height) hasPoint = true;
        return hasPoint;
    }
}