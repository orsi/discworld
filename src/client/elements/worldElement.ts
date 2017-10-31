import { EventManager } from '../../common/eventManager';

export class WorldElement extends HTMLElement {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    bufferCanvas: HTMLCanvasElement;
    bufferCtx: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor (events: EventManager) {
        super();

        // main canvas
        this.canvas = document.createElement('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.appendChild(this.canvas);

        // buffer canvas
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCtx = <CanvasRenderingContext2D>this.canvas.getContext('2d');

        // setup width/height
        this.resize(window.innerWidth, window.innerHeight);
    }
    /**
     * Resizes the world element to size of the window
     */
    resize (width: number, height: number) {
      this.style.width = width + 'px';
      this.style.height = height + 'px';
      this.width = this.bufferCanvas.width = this.canvas.width = width;
      this.height = this.bufferCanvas.height = this.canvas.height = height;
    }
    onResize (e: UIEvent) {
      this.resize(window.innerWidth, window.innerHeight);
    }
    getContext () { return this.ctx; }
  }
  window.customElements.define('reverie-world', WorldElement);