/**
 * Discworld DOM rendering library.
 */
import * as client from './client';
import Component from './components/component';
import { clearInterval } from 'timers';

let components: Component[] = [];
export let windowWidth = 0;
export let windowHeight = 0;

// attach hooks to browser events
window.addEventListener('resize',       (e: Event) => onWindowResize(e));
window.addEventListener('contextmenu',  (e) => e.preventDefault()); // prevents context menu

export function render (el: Component, container?: Component) {
    if (container) {
        container.shadow.appendChild(el);
    } else {
        client.body.appendChild(el);
    }
    return new DOMComponent(el);
}
export function select (el: Component) {
    return new DOMComponent(el);
}
function onWindowResize (e: Event) {
    let window = <Window>e.currentTarget;
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}

/**
 * Wrapper for components. Provides extra functionality
 * for DOM manipulation.
 */
class DOMComponent {
    constructor (public component: Component) {}
    position (x: number, y: number) {
        this.component.style.top = x + 'px';
        this.component.style.left = y + 'px';
        return this;
    }
    fadeIn (d?: number, cb?: () => void) {
        let duration = d || 500;
        const start = new Date().getTime();
        let el = this.component;
        el.style.opacity = '0';
        let fade = function () {
            let now = new Date().getTime();
            let delta = now - start;
            let opacity = delta / duration;
            if (opacity > 1) opacity = 1;
            el.style.opacity = opacity.toString();
            if (now - start < duration) {
                setTimeout(fade, 16);
            } else {
                if (cb) cb();
            }
        };
        let interval = setTimeout(fade, 16);
        return this;
    }
    fadeOut (d?: number, cb?: () => void) {
        let duration = d || 500;
        const start = new Date().getTime();
        let el = this.component;
        el.style.opacity = '1';
        let fade = function () {
            let now = new Date().getTime();
            let delta = now - start;
            let opacity = 1 - (delta / duration);
            if (opacity < 0) opacity = 0;
            el.style.opacity = opacity.toString();
            if (now - start < duration) {
                setTimeout(fade, 16);
            } else {
                if (cb) cb();
            }
        };
        let interval = setTimeout(fade, 16);
        return this;
    }
}