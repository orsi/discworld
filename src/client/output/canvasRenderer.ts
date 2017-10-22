export class CanvasRenderer {
    constructor () {}

    clear() {}
    getImageData(x: number, y: number, width: number, height: number): ImageData {
        return new ImageData(width, height);
    }
    putImageData(image: ImageData, x: number, y: number) {}
}