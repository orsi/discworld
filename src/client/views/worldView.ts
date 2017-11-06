import { Renderable } from '../../common/ecs/components/renderable';
import { WorldModel } from '../../common/world/models/worldModel';
import { ViewRenderer } from '../output/viewRenderer';

export class WorldView {
    constructor () {}

    draw (ctx: CanvasRenderingContext2D, view: ViewRenderer, model: WorldModel) {
        const map = model.map;
        for (let ix = 0; ix < map.length; ix++) {
            for (let iy = 0; iy < map[ix].length; iy++) {
                let alive = map[ix][iy];
                let viewPosition = view.mapWorldLocationToPixel(ix, iy);
                ctx.fillStyle = alive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.3)';
                ctx.fillRect(viewPosition.x + view.xOffset + view.xCenter, viewPosition.y + view.yOffset + view.yCenter, view.BLOCK_SIZE, view.BLOCK_SIZE);
            }
        }
    }
}