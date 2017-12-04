import { Point2D } from '../../common/data/point2d';
import { Point3D } from '../../common/data/point3d';

export class WorldRenderer {
    top: number = 0;
    left: number = 0;
    width: number;
    height: number;
    zoomScale: number;
    originPixel: Point2D = new Point2D(0, 0);
    originWorld: Point3D = new Point3D(0, 0, 0);
    BLOCK_SIZE = 32;
    constructor () {
      this.top = 0;
      this.left = 0;
      this.zoomScale = 1;
    }
    setWorldCenter (point: Point3D) {
      this.originWorld.x = point.x;
      this.originWorld.y = point.y;
      this.originWorld.z = point.z;
    }
    setWorldOrigin (x: number, y: number, z: number) {
      this.originWorld.x = x;
      this.originWorld.y = y;
      this.originWorld.z = z;
    }
    mapWorldLocationToPixel (x: number, y: number, z: number) {
      let pixelX = (x - this.originWorld.x) * this.BLOCK_SIZE
                  + (y - this.originWorld.y) * this.BLOCK_SIZE
                  + this.originPixel.x;
      let pixelY = (y - this.originWorld.y) * (this.BLOCK_SIZE / 2)
                  - (x - this.originWorld.x) * (this.BLOCK_SIZE / 2)
                  - (z - this.originWorld.z) * (this.BLOCK_SIZE / 2)
                  + this.originPixel.y;
      return new Point2D(pixelX, pixelY);
    }
    mapToPixel (point: Point3D) {
      return this.mapWorldLocationToPixel(point.x, point.y, point.z);
    }
    mapPixelToWorldLocation (x: number, y: number) {
      let worldX = Math.floor(x / this.BLOCK_SIZE);
      let worldY = Math.floor(y / this.BLOCK_SIZE);
      return {
        x: worldX,
        y: worldY
      };
    }
    pixelToMap (point: Point2D) {
      this.mapPixelToWorldLocation(point.x, point.y);
    }
    zoom (scale: number) {
      this.zoomScale = scale;
    }
    setSize (width: number, height: number) {
      this.width = width;
      this.height = height;
      this.originPixel.x = width / 2;
      this.originPixel.y = height / 2;
    }
    isOnScreen (x: number, y: number, z: number) {
      let point = this.mapWorldLocationToPixel(x, y, z);
      // takes canvas positions and sees whether it's in view
      return  point.x + this.BLOCK_SIZE >= 0
              && point.x - this.BLOCK_SIZE <= this.width
              && point.y + this.BLOCK_SIZE >= 0
              && point.y - this.BLOCK_SIZE <= this.height;
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