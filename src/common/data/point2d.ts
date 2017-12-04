export class Point2D {
    constructor (public x: number, public y: number) {}
    distanceTo (x: number, y: number) {
        return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
    }
}