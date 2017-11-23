import { WorldModule } from '../worldModule';
import { EntityView } from './entityView';
import { RendererView } from './rendererView';

export class WorldView {
    worldModule: WorldModule;
    entityView: EntityView;
    constructor (worldModule: WorldModule) {
        this.worldModule = worldModule;
        this.entityView = new EntityView();
    }

    draw (ctx: CanvasRenderingContext2D, view: RendererView) {
        for (let ix = 0; ix < this.worldModule.map.length - 1; ix++) {
            for (let iy = 0; iy < this.worldModule.map[ix].length - 1; iy++) {
                let alive = this.worldModule.map[ix][iy].land;
                let alpha = alive ? '1' : '.3';
                let tile = this.worldModule.map[ix][iy].tile ? this.worldModule.map[ix][iy].tile.name : 'null';
                let color = '';
                switch (tile) {
                    case 'rock':
                        color = '150,150,150';
                        break;
                    case 'grass':
                        color = '0,150,0';
                        break;
                    case 'water':
                        color = '0,0,150';
                        break;
                    case 'dirt':
                        color = '150,120,0';
                        break;
                    case 'null':
                        color = '45,45,45';
                        break;
                }
                let viewPosition = view.mapWorldLocationToPixel(this.worldModule.map[ix][iy].x,  this.worldModule.map[ix][iy].y);
                ctx.fillStyle = `rgba(${color},${alpha})`;
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