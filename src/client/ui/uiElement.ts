import { uuid } from '../../common/utils/uuid';

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
        this.registerInputHandlers();
    }
    private registerInputHandlers () {
        this.addEventListener('click',      (e) => this.onClick(<MouseEvent>e));
        this.addEventListener('dblclick',   (e) => this.onDoubleClick(<MouseEvent>e));
        this.addEventListener('drag',       (e) => this.onDrag(<MouseEvent>e));
        this.addEventListener('dragstart',  (e) => this.onDragStart(<MouseEvent>e));
        this.addEventListener('dragend',    (e) => this.onDragEnd(<MouseEvent>e));
        this.addEventListener('mousedown',  (e) => this.onMouseDown(<MouseEvent>e));
        this.addEventListener('mouseup',    (e) => this.onMouseUp(<MouseEvent>e));
        this.addEventListener('mouseover',  (e) => this.onMouseOver(<MouseEvent>e));
        this.addEventListener('mousemove',  (e) => this.onMouseMove(<MouseEvent>e));
    }
    onClick (e: MouseEvent) {
        console.log(this.serial + ' clicked');
    }
    onDoubleClick (e: MouseEvent) {
        console.log(this.serial + ' double clicked');
    }
    onDrag (e: MouseEvent) {
        console.log(this.serial + ' dragged');
    }
    onDragStart (e: MouseEvent) {
        console.log(this.serial + ' drag start');
    }
    onDragEnd (e: MouseEvent) {
        console.log(this.serial + ' drag end');
    }
    onMouseDown (e: MouseEvent) {
        console.log(this.serial + ' mouse down');
    }
    onMouseUp (e: MouseEvent) {
        console.log(this.serial + ' mouse up');
    }
    onMouseOver (e: MouseEvent) {
        console.log(this.serial + ' mouse over');
    }
    onMouseMove (e: MouseEvent) {
        console.log(this.serial + ' mouse move');
    }
    hasPoint (x: number, y: number) {
        let hasPoint = false;
        // within width and height coordinates
        if (x > this.x && x < this.x + this.width
            && y > this.y && y < this.y + this.height) hasPoint = true;
        return hasPoint;
    }
}