import State from './state';

/** Services */
import * as client from '../client';
import * as server from '../reverieServer';
import * as dom from '../dom';

/** Data */
import WorldDataPacket from '../../../common/data/net/server/worldData';
import WorldDestroyPacket from '../../../common/data/net/server/worldData';
import { default as TitleComponent } from '../components/ui/title';
import { default as WorldComponent } from '../components/world';

export default class Start extends State {
    title: TitleComponent;
    world: WorldComponent;
    constructor () {
        super();

        // create title component
        this.title = new TitleComponent();
        dom.render(this.title, client.reverie);

        server.on('world/data', (p: WorldDataPacket) => this.onWorldStatus(p));
        server.on('world/destroy', (p: WorldDestroyPacket) => this.onWorldDestroy(p));

        // server.on('region/data', (p: Packets.Server.RegionDataPacket) => this.onRegionData(p));
        // server.on('entity/speech', (p: Packets.Server.EntityChatPacket) => this.onEntityChat(p));
        // server.on('entity/move', (p: Packets.Server.EntityPositionPacket) => this.onEntityMove(p));
        // server.on('entity/remove', (p: Packets.Server.EntityRemovePacket) => this.onEntityRemove(p));
    }
    onWorldStatus (p: WorldDataPacket) {
        console.log(p);
        if (!this.world) {
            // create world component
            this.world = new WorldComponent();
            dom.render(this.world, client.reverie);
            dom.select(this.world).fadeIn(3000);
            this.world.addEventListener('world-click', (e: Event) => this.onWorldClick(<CustomEvent>e));
        }
        this.world.setWorldData(p);
    }
    onWorldDestroy (p: WorldDestroyPacket) {
        console.log(p);
        if (!this.world) return;
        dom.select(this.world).fadeOut(2000, () => {
            this.world.remove();
            delete this.world;
        });
    }
    onWorldClick(e: CustomEvent) {
        console.log(e);
    }
    pause () {}
    resume () {}
    update (delta: number) {
        if (this.world) this.world.update(delta);
    }
    render (interpolation: number) {}
    dispose () {}
}