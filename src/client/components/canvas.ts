import { EventManager } from '../eventManager';

export class Canvas extends HTMLElement {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor (events: EventManager) {
        super();

        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.appendChild(this.canvas);

        // hook into events manager
        events.on('window/resize', (e) => this.onResize(e));
        events.on('render', (img: ImageBitmap) => this.onRender(img));
    }
    onResize (e: UIEvent) {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    onRender (img: ImageBitmap) {
      this.ctx.drawImage(img, 0, 0);
    }
    clear () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
  window.customElements.define('reverie-canvas', Canvas);