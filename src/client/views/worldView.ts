import { EntityView } from './entityView';
import { RendererView } from '../rendererView';
import { WorldModule } from '../worldModule';

export class WorldView {
    worldModule: WorldModule;
    entityView: EntityView;
    constructor (worldModule: WorldModule) {
        this.worldModule = worldModule;
        this.entityView = new EntityView();
    }

    draw (ctx: CanvasRenderingContext2D, view: RendererView) {
        if (this.worldModule.world) {
            const map = Array.from(this.worldModule.map);
            for (let ix = 0; ix < map.length; ix++) {
                for (let iy = 0; iy < map[ix].length; iy++) {
                    let alive = map[ix][iy];
                    let viewPosition = view.mapWorldLocationToPixel(ix, iy);
                    ctx.fillStyle = alive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.3)';
                    ctx.fillRect(viewPosition.x + view.xOffset + view.xCenter, viewPosition.y + view.yOffset + view.yCenter, view.BLOCK_SIZE, view.BLOCK_SIZE);
                }
            }
            let entities = this.worldModule.entities.getAll();
            for (let serial in entities) {
                let entity = entities[serial];
                this.entityView.draw(ctx, view, entity.entity);
            }
        }
    }
}