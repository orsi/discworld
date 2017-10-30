import { Updateable } from '../../common/ecs/components/updateable';
import { TileModel } from '../../common/world/models/tileModel';
import { TileView } from './views/tileView';

export class Tile implements Updateable {
    constructor () {}
    update(delta: number) {}
}