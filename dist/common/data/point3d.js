"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    distanceTo(point) {
        return Math.sqrt(Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2));
    }
}
exports.Point3D = Point3D;
//# sourceMappingURL=point3d.js.map