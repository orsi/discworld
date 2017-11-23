import { uuid } from '../../common/utils/uuid';
import { UIModule } from '../uiModule';

export class UIElement extends HTMLElement {
    x = 0;
    y = 0;
    width: number;
    height: number;
    serial: string;
    name: string;
    ui: UIModule;
    constructor (name: string, ui: UIModule) {
        super();
        this.name = name;
        this.serial = uuid();
        this.id = this.serial;
        this.ui = ui;
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
        this.ui.addEvent(this, e);
    }
    onDoubleClick (e: MouseEvent) {
        console.log(this.serial + ' double clicked');
        this.ui.addEvent(this, e);
    }
    onDrag (e: MouseEvent) {
        console.log(this.serial + ' dragged');
        this.ui.addEvent(this, e);
    }
    onDragStart (e: MouseEvent) {
        console.log(this.serial + ' drag start');
        this.ui.addEvent(this, e);
    }
    onDragEnd (e: MouseEvent) {
        console.log(this.serial + ' drag end');
        this.ui.addEvent(this, e);
    }
    onMouseDown (e: MouseEvent) {
        console.log(this.serial + ' mouse down');
        this.ui.addEvent(this, e);
    }
    onMouseUp (e: MouseEvent) {
        console.log(this.serial + ' mouse up');
        this.ui.addEvent(this, e);
    }
    onMouseOver (e: MouseEvent) {
        console.log(this.serial + ' mouse over');
        this.ui.addEvent(this, e);
    }
    onMouseMove (e: MouseEvent) {
        console.log(this.serial + ' mouse move');
        this.ui.addEvent(this, e);
    }
    hasPoint (x: number, y: number) {
        let hasPoint = false;
        // within width and height coordinates
        if (x > this.x && x < this.x + this.width
            && y > this.y && y < this.y + this.height) hasPoint = true;
        return hasPoint;
    }
}