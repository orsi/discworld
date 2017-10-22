import { EventManager } from './EventManager';
import { ViewRenderer } from './output/viewRenderer';
import { CanvasRenderer } from './output/canvasRenderer';

export class Renderer {
  events: EventManager;
  view: ViewRenderer;
  main: CanvasRenderer;
  buffer: CanvasRenderer;
  lastRender = new Date().getTime();
  delta: number;

  constructor (events: EventManager) {
    this.events = events;
    this.view = new ViewRenderer(window.innerWidth, window.innerHeight);
    this.main = new CanvasRenderer();
    this.buffer = new CanvasRenderer();
  }

  move (x: number, y: number) {
    // move offset relative to scale size
    // so that it doesn't become slow when
    // zoomed in
    this.view.offset.x -= Math.floor(x * this.view.zoom * this.view.minSize / 2);
    this.view.offset.y -= Math.floor(y * this.view.zoom * this.view.minSize / 2);
  }
  render (renderables: Renderable[]) {
    let now = new Date().getTime();
    this.delta = now - this.lastRender;
    this.lastRender = now;

    // clear buffer and canvas
    this.buffer.clear();
    this.main.clear();

    for (let renderable of renderables) {
      renderable.draw(this.buffer);
    }
    // switch to main canvas
    this.swap();
  }
  swap () {
    // cut the drawn rectangle
    const image = this.buffer.getImageData(this.view.left, this.view.top, this.view.width, this.view.height);
    // copy into visual canvas at different position
    this.main.putImageData(image, 0, 0);
  }
}

interface Renderable {
  draw(ctx: CanvasRenderer): void;
}

// function OLD (world) {
//   // have to do translations
//   // canvas x, y will be relative to blockSize, scale, center of screen x,y
//   for (var x = 0; x < world.x; x++) {
//     for (var y = 0; y < world.y; y++) {
//       for (var z = 0; z < world.z; z++) {
//         // var block = world.regions[x][y][z].block;
//         // if (block) {
//           var canvasPosition = view.worldToCanvas(world.regions[x][y][z].position);

//           // adjust offset of viewport
//           canvasPosition.x -= view.offset.x;
//           canvasPosition.y -= view.offset.y;

//           // if (x % 10 === 0 && y % 10 === 0) console.log(position, world.regions[x][y][z], view, view.center);
//           if (
//               inViewport(canvasPosition.x, canvasPosition.y - canvasPosition.z)
//               && isBlockVisible(x, y, z, world.x, world.y, world.z, world.regions)
//             )
//             drawBlock(canvasPosition.x, canvasPosition.y - canvasPosition.z, z, block, .99);
//         // }
//       }
//     }
//   }
//   // if (!worldLoaded) worldLoaded = true;
// }
