import { Renderable } from '../components/renderable';
import { WorldModel } from '../models/worldModel';

export class WorldView implements Renderable {
    model: WorldModel;
    constructor (model: WorldModel) {
        this.model = model;
    }

    draw (ctx: CanvasRenderingContext2D) {
        const map = this.model.map;
        for (let ix = 0; ix < map.length; ix++) {
            for (let iy = 0; iy < map[ix].length; iy++) {
                let alive = map[ix][iy];
                ctx.fillStyle = alive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.3)';
                ctx.fillRect(ix * 13, iy * 13, 12, 12);
            }
        }
    }
}