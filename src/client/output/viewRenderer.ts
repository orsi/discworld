export class ViewRenderer {
    top: number;
    left: number;
    width: number;
    height: number;
    center: { x: number, y: number };
    offset: { x: number, y: number };
    zoom: number;
    minSize: number;
    blockSize: number;
    constructor (width: number, height: number) {
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