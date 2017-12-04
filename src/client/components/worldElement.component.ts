import { Component } from './';
import { WorldRenderer } from '../world/worldRenderer';

export class WorldElement extends Component {
    renderer: WorldRenderer;
    constructor (renderer: WorldRenderer) {
        super();
        this.renderer = renderer;
    }
}