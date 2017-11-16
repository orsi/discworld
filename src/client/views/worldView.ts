import { Renderable } from '../../common/ecs/components/renderable';
import { EntityView } from './entityView';
import { Entity } from '../../common/ecs/entity';
import { RendererView } from '../rendererView';
import { World } from '../world';

export class WorldView {
    world: World;
    entityView: EntityView;
    constructor (world: World) {
        this.world = world;
        this.entityView = new EntityView();
    }

    draw (ctx: CanvasRenderingContext2D, view: RendererView) {
        if (this.world.model) {
            const map = this.world.model.map;
            for (let ix = 0; ix < map.length; ix++) {
                for (let iy = 0; iy < map[ix].length; iy++) {
                    let alive = map[ix][iy];
                    let viewPosition = view.mapWorldLocationToPixel(ix, iy);
                    ctx.fillStyle = alive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.3)';
                    ctx.fillRect(viewPosition.x + view.xOffset + view.xCenter, viewPosition.y + view.yOffset + view.yCenter, view.BLOCK_SIZE, view.BLOCK_SIZE);
                }
            }
            let entities = this.world.entities.getAllEntities();
            entities.forEach(entity => {
                this.entityView.draw(ctx, view, entity);
            });
        }
    }
}