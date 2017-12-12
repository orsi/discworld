"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../common/utils/uuid");
const point2d_1 = require("../../common/data/point2d");
class Component extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.serial = this.id = uuid_1.uuid();
        // Create a shadow root
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    render() { }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.style.width = width + 'px';
        this.style.height = height + 'px';
        this.center = new point2d_1.Point2D(width / 2, height / 2);
    }
}
exports.Component = Component;
//# sourceMappingURL=component.js.map