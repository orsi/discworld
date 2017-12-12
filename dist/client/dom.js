"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DOMRenderer {
    constructor(client) {
        this.components = [];
        this.client = client;
        let events = this.events = client.events;
        // html setup
        this.root = document.querySelector('#reverie');
        // general browser events
        window.addEventListener('resize', (e) => this.onWindowResize(e));
        window.addEventListener('contextmenu', (e) => e.preventDefault()); // prevents context menu
        // socket
        events.on('connect', (socket) => this.socket = socket);
    }
    render(interpolation) {
        this.components.forEach(c => c.render());
    }
    addComponent(comp) {
        this.components.push(comp);
        this.root.appendChild(comp);
        return comp;
    }
    removeComponent(serial) {
        let htmlElement = document.querySelector('#' + serial);
        if (htmlElement)
            htmlElement.remove();
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].serial === serial) {
                this.components.splice(i, 1);
                break;
            }
        }
    }
    onWindowResize(e) {
        let window = e.currentTarget;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.components.forEach(c => c.resize(window.innerWidth, window.innerHeight));
    }
}
exports.DOMRenderer = DOMRenderer;
//# sourceMappingURL=dom.js.map