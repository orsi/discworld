"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point2d_1 = require("../../common/data/point2d");
const point3d_1 = require("../../common/data/point3d");
class WorldRenderer {
    constructor(controller) {
        this.locations = {};
        this.elapsedTime = 0;
        this.top = 0;
        this.left = 0;
        this.zoomScale = 1;
        this.originPixel = new point2d_1.Point2D(0, 0);
        this.originWorld = new point3d_1.Point3D(0, 0, 0);
        this.BLOCK_SIZE = 32;
        this.controller = controller;
        this.locations = controller.locations;
    }
    update(delta) {
        this.elapsedTime += delta;
        // update origin of client location
        if (this.mainAgent)
            this.setWorldCenter(this.mainAgent.entity.location);
    }
    follow(agent) {
        this.mainAgent = agent;
    }
    setWorldCenter(point) {
        this.originWorld.x = point.x;
        this.originWorld.y = point.y;
        this.originWorld.z = point.z;
    }
    setWorldOrigin(x, y, z) {
        this.originWorld.x = x;
        this.originWorld.y = y;
        this.originWorld.z = z;
    }
    mapWorldLocationToPixel(x, y, z) {
        let pixelX = (x - this.originWorld.x) * this.BLOCK_SIZE
            + (y - this.originWorld.y) * this.BLOCK_SIZE
            + this.originPixel.x;
        let pixelY = (y - this.originWorld.y) * (this.BLOCK_SIZE / 2)
            - (x - this.originWorld.x) * (this.BLOCK_SIZE / 2)
            - (z - this.originWorld.z) * (this.BLOCK_SIZE / 2)
            + this.originPixel.y;
        return new point2d_1.Point2D(pixelX, pixelY);
    }
    mapToPixel(point) {
        return this.mapWorldLocationToPixel(point.x, point.y, point.z);
    }
    mapPixelToWorldLocation(x, y) {
        let worldX = Math.floor(x / this.BLOCK_SIZE);
        let worldY = Math.floor(y / this.BLOCK_SIZE);
        return {
            x: worldX,
            y: worldY
        };
    }
    pixelToMap(point) {
        this.mapPixelToWorldLocation(point.x, point.y);
    }
    zoom(scale) {
        this.zoomScale = scale;
    }
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.originPixel.x = width / 2;
        this.originPixel.y = height / 2;
    }
    isOnScreen(x, y, z) {
        let point = this.mapWorldLocationToPixel(x, y, z);
        // takes canvas positions and sees whether it's in view
        return point.x + this.BLOCK_SIZE >= 0
            && point.x - this.BLOCK_SIZE <= this.width
            && point.y + this.BLOCK_SIZE >= 0
            && point.y - this.BLOCK_SIZE <= this.height;
    }
    isObscured(bx, by, bz, maxX, maxY, maxZ, position) {
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
        if (neighbourX < maxX &&
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
    getMapLocation(x, y) {
        for (let serial in this.locations) {
            let location = this.locations[serial];
            if (location.x === x && location.y === y)
                return location;
        }
    }
}
exports.WorldRenderer = WorldRenderer;
//# sourceMappingURL=worldRenderer.js.map