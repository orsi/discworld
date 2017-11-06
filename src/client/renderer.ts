import { ViewRenderer } from './output/viewRenderer';
import { CanvasRenderer } from './output/canvasRenderer';
import * as Components from '../common/ecs/component';
import { World } from './world';
import { Agent } from './agent';

export class Renderer {
  agent: Agent;
  world: World;
  view: ViewRenderer;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bufferCanvas: HTMLCanvasElement;
  ctxBuffer: CanvasRenderingContext2D;
  lastRenderTime = new Date().getTime();
  delta: number;
  BLOCK_SIZE = 25;

  constructor (agent: Agent, world: World, canvas: HTMLCanvasElement, bufferCanvas: HTMLCanvasElement) {
    this.agent = agent;
    this.world = world;
    this.canvas = canvas;
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    this.bufferCanvas = bufferCanvas;
    this.ctxBuffer = <CanvasRenderingContext2D>bufferCanvas.getContext('2d');
    this.view = new ViewRenderer(0, 0, this.canvas.width, this.canvas.height);
  }

  // move (x: number, y: number) {
  //   // move offset relative to scale size
  //   // so that it doesn't become slow when
  //   // zoomed in
  //   this.view.offset.x -= Math.floor(x * this.view.zoom * this.view.minSize / 2);
  //   this.view.offset.y -= Math.floor(y * this.view.zoom * this.view.minSize / 2);
  // }
  update() {
    let agentEntity = this.agent.getEntity();
    if (agentEntity) {
      let position = agentEntity.getComponent<Components.PositionComponent>('position');
      if (position) {
        let viewPosition = this.view.mapWorldLocationToPixel(position.x, position.y);
        this.view.center(viewPosition.x, viewPosition.y);
      }
    }
  }
  render (interpolation: number) {
    let now = new Date().getTime();
    this.delta = now - this.lastRenderTime;
    this.lastRenderTime = now;

    // clear buffer and canvas
    // this.buffer.clear();
    // this.main.clear();
    this.ctxBuffer.fillStyle = '#333';
    this.ctxBuffer.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.world.draw(this.ctxBuffer, this.view);
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
// drawPlayerEntity (entity) {
//   let canvasPosition = this.view.worldToCanvas(
//     entity['position'].x,
//     entity['position'].y,
//     entity['position'].z
//   );
//   let widthOffset = entity['transform'].width / 2;
//   this.ctx.fillStyle = 'rgba(150,150,200,.8)';
//   this.ctx.fillRect(
//     canvasPosition.x - this.view.offset.x - widthOffset,
//     canvasPosition.y - this.view.offset.y - entity['transform'].height,
//     entity['transform'].width,
//     entity['transform'].height
//   );
// }
// drawEntities (entities) {
//   for (let e of entities) {
//     let canvasPosition = this.view.worldToCanvas(
//       e['position'].x,
//       e['position'].y,
//       e['position'].z
//     );
//     let widthOffset = e['transform'].width / 2;
//     this.ctx.fillStyle = 'rgba(150,150,200,.8)';
//     this.ctx.fillRect(
//       canvasPosition.x - this.view.offset.x - widthOffset,
//       canvasPosition.y - this.view.offset.y - e['transform'].height,
//       e['transform'].width,
//       e['transform'].height
//     );
//   }
// }
// drawDebugMaps (maps) {
//   let mx = my = mz = 32;
//   for (let x = 0; x < 32; x++) {
//     for (let y = 0; y < 32; y++) {
//       for (let z = 0; z < 32; z++) {
//         let canvasPosition = this.view.worldToCanvas(x, y, z);
//         canvasPosition.x -= this.view.offset.x;
//         canvasPosition.y -= this.view.offset.y;

//         let cellMap;
//         for (let i = 0; i < maps.cells.length; i++) {
//           if (maps.cells[i].z === z) cellMap = maps.cells[i];
//         }
//         if (this.view.isOnScreen(canvasPosition.x, canvasPosition.y) && cellMap && cellMap.values[x][y]) {
//             let val = maps.temperature[x][y][z];
//             let color;
//             if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
//             if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
//             this.ctx.fillStyle = color;

//             // console.log(color);
//             // console.log(x, y, z);
//             // draw bottom face
//             this.ctx.beginPath();
//             this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
//             this.ctx.lineTo(canvasPosition.x - this.view.blockSize / 2, canvasPosition.y - this.view.blockSize / 4);
//             this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (this.view.blockSize / 2));
//             this.ctx.lineTo(canvasPosition.x + this.view.blockSize / 2, canvasPosition.y - this.view.blockSize / 4);
//             this.ctx.closePath();
//             this.ctx.fill();
//         }
//       }
//     }
//   }
// }
// drawCellMap (cells) {
//   let mx = my = mz = 32;
//   for (let i = 0; i < 10; i++) {
//     for (let x = 0; x < mx; x++) {
//       for (let y = 0; y < my; y++) {
//         let canvasPosition = this.view.worldToCanvas(x, y, cells[i].z);
//         canvasPosition.x -= this.view.offset.x;
//         canvasPosition.y -= this.view.offset.y;
//         if (this.view.isOnScreen(canvasPosition.x, canvasPosition.y) && cells[i].values[x][y]) {
//             this.ctx.fillStyle = 'rgba(255,255,255,.5)';

//             // console.log(color);
//             // console.log(x, y, z);
//             // draw bottom face
//             this.ctx.beginPath();
//             this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
//             this.ctx.lineTo(canvasPosition.x - this.view.blockSize / 2, canvasPosition.y - this.view.blockSize / 4);
//             this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (this.view.blockSize / 2));
//             this.ctx.lineTo(canvasPosition.x + this.view.blockSize / 2, canvasPosition.y - this.view.blockSize / 4);
//             this.ctx.closePath();
//             this.ctx.fill();
//         }
//       }
//     }
//   }
// }
// drawWorldMap (wm) {
//   let mx = my = mz = wm.length;
//   for (let x = 0; x < mx; x++) {
//     for (let y = 0; y < my; y++) {
//       for (let z = 0; z < mz; z++) {
//           let canvasPosition = this.view.worldToCanvas(x, y, z);
//           canvasPosition.x -= this.view.offset.x;
//           canvasPosition.y -= this.view.offset.y;
//         if (
//           this.view.isOnScreen(canvasPosition.x, canvasPosition.y)
//           && (z == mx - 1 || y == mx - 1 || x == mx - 1) // if any position is toward cam
//           ) {
//             let val = wm[x][y][z];
//             let color;
//             if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
//             if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
//             this.ctx.fillStyle = color;

//             // console.log(color);
//             // console.log(x, y, z);
//             // draw bottom face
//             this.ctx.beginPath();
//             this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
//             this.ctx.lineTo(canvasPosition.x - this.view.blockSize / 2, canvasPosition.y - this.view.blockSize / 4);
//             this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (this.view.blockSize / 2));
//             this.ctx.lineTo(canvasPosition.x + this.view.blockSize / 2, canvasPosition.y - this.view.blockSize / 4);
//             this.ctx.closePath();
//             this.ctx.fill();
//         }
//       }
//     }
//   }
// }
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
