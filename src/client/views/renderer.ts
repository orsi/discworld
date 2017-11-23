import { RendererView } from './rendererView';
import { WorldView } from './worldView';

export class Renderer {
  view: RendererView;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bufferCanvas: HTMLCanvasElement;
  ctxBuffer: CanvasRenderingContext2D;
  worldView: WorldView;
  lastRenderTime = new Date().getTime();
  delta: number;
  BLOCK_SIZE = 25;

  constructor (worldView: WorldView, canvas: HTMLCanvasElement, bufferCanvas: HTMLCanvasElement) {
    this.worldView = worldView;
    this.canvas = canvas;
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    this.bufferCanvas = bufferCanvas;
    this.ctxBuffer = <CanvasRenderingContext2D>bufferCanvas.getContext('2d');
    this.view = new RendererView(0, 0, this.canvas.width, this.canvas.height);
  }
  centerMap (x: number, y: number) {
    let viewPosition = this.view.mapWorldLocationToPixel(x, y);
    this.view.center(viewPosition.x, viewPosition.y);
  }
  render (interpolation: number) {
    let now = new Date().getTime();
    this.delta = now - this.lastRenderTime;
    this.lastRenderTime = now;

    this.ctxBuffer.fillStyle = '#333';
    this.ctxBuffer.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.worldView.draw(this.ctxBuffer, this.view);
    this.swap();
  }
  swap () {
    // cut the drawn rectangle
    const image = this.ctxBuffer.getImageData(this.view.left, this.view.top, this.view.width, this.view.height);
    // copy into visual canvas at different position
    this.ctx.putImageData(image, 0, 0);
  }
  setViewportSize (width: number, height: number) {
    this.view.setSize(width, height);
  }
  centerView (x: number, y: number) {
    this.view.center(x, y);
  }
}