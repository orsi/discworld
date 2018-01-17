export default class Point3D {
    constructor (public x: number, public y: number, public z: number) {}
    distanceTo (point: Point3D) {
        return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
    }
}