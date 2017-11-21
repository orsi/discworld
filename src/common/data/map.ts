export class Map2D<T> {
    private arr: T[] = [];
    constructor (public width: number = 0, public height: number = 0) {
        console.log(width, height);
        this.arr.length = width * height;
    }
    get (x: number, y: number) {
        return this.arr[x * y];
    }
    set (x: number, y: number, data: T) {
        this.arr[x * y] = data;
    }
}