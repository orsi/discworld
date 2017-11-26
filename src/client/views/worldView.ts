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
        // draw along x axis first, so that y axis overdraws
        for (let iy = 0; iy < this.worldModule.map.length - 1; iy++) {
            for (let ix = 0; ix < this.worldModule.map[iy].length - 1; ix++) {
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
                    let viewPosition = view.mapWorldLocationToPixel(this.worldModule.map[ix][iy].x, this.worldModule.map[ix][iy].y, this.worldModule.map[ix][iy].z);
                    let x = viewPosition.x + view.xOffset + view.xCenter;
                    let y = viewPosition.y + view.yOffset + view.yCenter;
                    let z = this.worldModule.map[ix][iy].z;

                    // neighbouring tiles
                    let n = this.worldModule.map[ix] ? this.worldModule.map[ix][iy - 1] : undefined;
                    let ne = this.worldModule.map[ix + 1] ? this.worldModule.map[ix + 1][iy - 1] : undefined;
                    let e = this.worldModule.map[ix + 1] ? this.worldModule.map[ix + 1][iy] : undefined;
                    let se = this.worldModule.map[ix + 1] ? this.worldModule.map[ix + 1][iy + 1] : undefined;
                    let s = this.worldModule.map[ix] ? this.worldModule.map[ix][iy + 1] : undefined;
                    let sw = this.worldModule.map[ix - 1] ? this.worldModule.map[ix - 1][iy + 1] : undefined;
                    let w = this.worldModule.map[ix - 1] ? this.worldModule.map[ix - 1][iy] : undefined;
                    let nw = this.worldModule.map[ix - 1] ? this.worldModule.map[ix - 1][iy - 1] : undefined;

                    // find the average of the 3 surrounding corner tiles
                    let topSkew = 0, rightSkew = 0, bottomSkew = 0, leftSkew = 0;
                    // top corner
                    topSkew += n && n.z >= 0 ? (z - n.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    topSkew += ne && ne.z >= 0 ? (z - ne.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    topSkew += e && e.z >= 0 ? (z - e.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    // right corner
                    rightSkew += e && e.z >= 0 ? (z - e.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    rightSkew += se && se.z >= 0 ? (z - se.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    rightSkew += s && s.z >= 0 ? (z - s.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    // bottom corner
                    bottomSkew += s && s.z >= 0 ? (z - s.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    bottomSkew += sw && sw.z >= 0 ? (z - sw.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    bottomSkew += w && w.z >= 0 ? (z - w.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    // left corner
                    leftSkew += w && w.z >= 0 ? (z - w.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    leftSkew += nw && nw.z >= 0 ? (z - nw.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;
                    leftSkew += n && n.z >= 0 ? (z - n.z) * view.BLOCK_SIZE * 0.5 * 0.3 : 0;

                    ctx.fillStyle = `rgba(${color},${ z / 32 })`;
                    ctx.beginPath();
                    ctx.moveTo(x, y + topSkew); // top
                    ctx.lineTo(x + view.BLOCK_SIZE, y + (view.BLOCK_SIZE / 2) + rightSkew); // right
                    ctx.lineTo(x, y + view.BLOCK_SIZE + bottomSkew); // bottom
                    ctx.lineTo(x - view.BLOCK_SIZE, y + (view.BLOCK_SIZE / 2) + leftSkew); // left
                    ctx.lineTo(x, y + topSkew); // top
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