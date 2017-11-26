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
                if (this.worldModule.map[ix][iy].land) {
                    // tiles
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
                    // height
                    let height = this.worldModule.map[ix][iy].height;
                    if (!height) height = 0;
                    let alpha = height / 32;

                    let viewPosition = view.mapWorldLocationToPixel(this.worldModule.map[ix][iy].x,  this.worldModule.map[ix][iy].y);
                    let x = viewPosition.x + view.xOffset + view.xCenter;
                    let y = (viewPosition.y + view.yOffset + view.yCenter);

                    ctx.fillStyle = `rgba(${color},${alpha})`;

                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + view.BLOCK_SIZE, y + (view.BLOCK_SIZE / 2));
                    ctx.lineTo(x, y + view.BLOCK_SIZE);
                    ctx.lineTo(x - view.BLOCK_SIZE, y + (view.BLOCK_SIZE / 2));
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.fill();
                }
            }
        }
        let entities = this.worldModule.entities.getAll();
        for (let serial in entities) {
            let entity = entities[serial];
            this.entityView.draw(ctx, view, entity.entity);
        }
    }
}