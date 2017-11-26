export class RendererView {
    top: number;
    left: number;
    width: number;
    height: number;
    xCenter: number;
    yCenter: number;
    zoomScale: number;
    xOffset: number;
    yOffset: number;
    BLOCK_SIZE = 32;
    constructor (top: number, left: number, width: number, height: number) {
      this.top = 0;
      this.left = 0;
      this.width = width;
      this.height = height;
      this.xCenter = Math.floor(width / 2);
      this.yCenter = Math.floor(height / 2);
      this.xOffset = 0;
      this.yOffset = 0;
      this.zoomScale = 1;
    }
    move (x: number, y: number) {
      this.center(x, y);
    }
    center (x: number, y: number) {
      this.xOffset = -x;
      this.yOffset = -y;
    }
    mapWorldLocationToPixel (x: number, y: number) {
      let pixelX = x * this.BLOCK_SIZE + y * this.BLOCK_SIZE;
      let pixelY = y * (this.BLOCK_SIZE / 2) - x * (this.BLOCK_SIZE / 2);
      return {
        x: pixelX,
        y: pixelY
      };
    }
    mapPixelToWorldLocation (x: number, y: number) {
      let worldX = Math.floor(x / this.BLOCK_SIZE);
      let worldY = Math.floor(y / this.BLOCK_SIZE);
      return {
        x: worldX,
        y: worldY
      };
    }
    zoom (scale: number) {
      this.zoomScale = scale;
    }
    setSize (width: number, height: number) {
      this.width = width;
      this.height = height;
      this.xCenter = Math.floor(width / 2);
      this.yCenter = Math.floor(height / 2);
    }
    isOnScreen (x: number, y: number) {
      // takes canvas positions and sees whether it's in view
      return  x + this.BLOCK_SIZE >= this.left
              && x - this.BLOCK_SIZE <= this.left + this.width
              && y + this.BLOCK_SIZE >= this.top
              && y - this.BLOCK_SIZE <= this.top + this.height;
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
  }