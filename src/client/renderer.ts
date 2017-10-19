export class Renderer {
  view: View;
  canvasElement: HTMLCanvasElement;
  canvas: Canvas;
  buffer: Canvas;
  lastRender: number;
  delta: number;
  constructor (canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
    this.view = new View(window.innerWidth, window.innerHeight, this);
    this.canvas = new Canvas(this.view.width, this.view.height);
    this.buffer = new Canvas(this.view.width, this.view.height);
    this.lastRender = new Date().getTime();
    return this;
  }
  move (x: number, y: number) {
    // move offset relative to scale size
    // so that it doesn't become slow when
    // zoomed in
    this.view.offset.x -= Math.floor(x * this.view.zoom * this.view.minSize / 2);
    this.view.offset.y -= Math.floor(y * this.view.zoom * this.view.minSize / 2);
  }
  resize () {
    this.view.width = this.buffer.element.width = this.canvas.element.width = window.innerWidth;
    this.view.height = this.buffer.element.height = this.canvas.element.height = window.innerHeight;

    this.view.center.x = Math.floor(this.view.width / 2);
    this.view.center.y = Math.floor(this.view.height / 2);
  }
  render (state: any) {
    let now = new Date().getTime();
    this.delta = now - this.lastRender;
    this.lastRender = now;

    // clear buffer and canvas
    this.buffer.clear();
    this.canvas.clear();

    // draw to buffer
    // if (state.world) {
    //   this.buffer.drawWorldMap(state.world);
    // }
    // if (state.regions) {
    //   for (let region of state.regions) {
    //     region.render(this.buffer.ctx, view);
    //   }
    // }
    // if (state.entity) {
    //   this.view.follow(state.entity['position'].x, state.entity['position'].y, state.entity['position'].z);
    //   this.buffer.drawPlayerEntity(state.entity);
    // }
    // if (state.entities) {
    //   state.entities.forEach(function (entity) {
    //     entity.render(this.buffer.ctx, view);
    //   });
    // }
    // if (state.debug) {
    //   // console.log(state.debug.cells)
    //   if (state.debug) this.buffer.drawDebugMaps(state.debug);
    // }

    // switch to canvas
    this.swap();
  }
  swap () {
    // cut the drawn rectangle
    const image = this.buffer.ctx.getImageData(this.view.left, this.view.top, this.view.width, this.view.height);
    // copy into visual canvas at different position
    this.canvas.ctx.putImageData(image, 0, 0);
  }
}

export class Canvas {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor (width: number, height: number) {
    this.element = document.createElement('canvas');
    this.ctx = <CanvasRenderingContext2D>this.element.getContext('2d');
    this.width = this.element.width = window.innerWidth;
    this.height = this.element.height = window.innerHeight;
  }
  clear () {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
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
}
export class View {
  renderer: Renderer;
  top: number;
  left: number;
  width: number;
  height: number;
  center: { x: number, y: number };
  offset: { x: number, y: number };
  zoom: number;
  minSize: number;
  blockSize: number;
  constructor (width: number, height: number, renderer: Renderer) {
    this.top = 0;
    this.left = 0;
    this.width = width;
    this.height = height;
    this.center = {
      x: Math.floor(this.width / 2),
      y: Math.floor(this.height / 2)
    };
    this.offset = {
      x: 0,
      y: 0
    };
    this.zoom = 1;
    this.minSize = 12;
    this.blockSize = 32;
    this.renderer = renderer;
  }
  follow (x: number, y: number, z: number) {
    this.centerOn(x, y);
  }
  centerOn (x: number, y: number) {
    this.offset.x = x - this.center.x;
    this.offset.y = y - this.center.y;
  }
  isOnScreen (x: number, y: number) {
    // takes canvas positions and sees whether it's in view
    return  x + this.blockSize >= this.left
            && x - this.blockSize <= this.left + this.width
            && y + this.blockSize >= this.top
            && y - this.blockSize <= this.top + this.height;
  }
  isObscured (bx: number, by: number, bz: number, maxX: number, maxY: number, maxZ: number, position: any) {
    // check if there are any blocks directly
    // infront of this from the viewport perspective
    let offsetX = bx + 1;
    let offsetY = by + 1;
    let offsetZ = bz + 1;
    let viewportVisible = true;
    for (let i = 0; offsetX < maxX && offsetY < maxY && offsetZ < maxZ; i++) {
      let block = position[offsetX][offsetY][offsetZ].block;
      if (block !== null) {
        viewportVisible = false;
        break;
      }
      offsetX++;
      offsetY++;
      offsetZ++;
    }

    // check if all neighbours are covering
    // all of this blocks faces
    let neighbourX = bx + 1;
    let neighbourY = by + 1;
    let neighbourZ = bz + 1;
    let faceVisible = true;
    if (
      neighbourX < maxX &&
      neighbourY < maxY &&
      neighbourZ < maxZ &&
      position[neighbourX][by][bz].block !== null &&
      position[bx][neighbourY][bz].block !== null &&
      position[bx][by][neighbourZ].block !== null) {
        faceVisible = false;
    }

    // if (bx % 10 === 0 && by % 10 === 0 ) console.log(viewportVisible, faceVisible);
    return viewportVisible && faceVisible;
  }
  worldToCanvas (wx: number, wy: number, wz: number) {
    let cx = ((wx - wy) * this.blockSize / 2);
    let cy = ((wy + wx) * this.blockSize / 4) - (wz * this.blockSize / 2);

    // if (position.x % 10 === 0 && position.y % 10 === 0) console.log(position, blockX, blockY, blockZ);
    return {
      x: cx,
      y: cy
    };
  }
  canvasToWorld (canvasPosition: any) {
    // return world position in center of viewport
    let x = ((canvasPosition.x + canvasPosition.y) * 2 / this.blockSize);
    let y = ((canvasPosition.y - canvasPosition.x) * 4 / this.blockSize);

    // if (canvasPosition.x % 10 === 0 && canvasPosition.y % 10 === 0) console.log(x, y);
    return {
      x: Math.floor(x),
      y: Math.floor(y),
    };
  }
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
