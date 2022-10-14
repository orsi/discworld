import State from './state';
import * as client from '..';
import * as dom from '../dom';
import { default as TitleComponent } from '../components/ui/title';
import { default as WorldComponent } from '../components/world';

export default class Start extends State {
    title: TitleComponent;
    world?: WorldComponent;
    constructor() {
        super();

        // create title component
        this.title = new TitleComponent();
        dom.render(this.title, client.discworld);
    }
    onWorldStatus() {
        if (!this.world) {
            // create world component
            this.world = new WorldComponent();
            dom.render(this.world, client.discworld);
            dom.select(this.world).fadeIn(3000);
            this.world.addEventListener('world-click', (e: Event) => this.onWorldClick(<CustomEvent>e));
        }
        this.world.setWorldData({});
    }
    onWorldDestroy() {
        if (!this.world) return;
        dom.select(this.world).fadeOut(2000, () => {
            this.world?.remove();
            delete this.world;
        });
    }
    onWorldClick(e: CustomEvent) {
        console.log(e);
    }
    pause() { }
    resume() { }
    update(delta: number) {
        if (this.world) this.world.update(delta);
    }
    render(interpolation: number) { }
    dispose() { }
}