import * as server from '../reverieServer';
import { Client } from '../client';
import { State } from './state';
import * as Packets from '../../common/data/net';
import { TitleComponent, WorldComponent } from '../components';

export class WorldState extends State {
    title: TitleComponent;
    world: WorldComponent;
    constructor (client: Client) {
        super(client);

        this.title = this.client.dom.addComponent(new TitleComponent());
        this.world = this.client.dom.addComponent(new WorldComponent());
        this.world.addEventListener('world-click', (e: Event) => this.onWorldClick(<CustomEvent>e));

        // server.on('region/data', (p: Packets.Server.RegionDataPacket) => this.onRegionData(p));
        // server.on('entity/speech', (p: Packets.Server.EntityChatPacket) => this.onEntityChat(p));
        // server.on('entity/move', (p: Packets.Server.EntityPositionPacket) => this.onEntityMove(p));
        // server.on('entity/remove', (p: Packets.Server.EntityRemovePacket) => this.onEntityRemove(p));
    }
    onWorldClick(e: CustomEvent) {
        console.log(e);
    }
      onRegionData (p: Packets.Server.RegionDataPacket) {
        console.log(p);
        // let region = this.regions[p.serial];
        // if (!region) {
        //   let newRegion = new WorldRegion(
        //     p.serial,
        //     p.type,
        //     p.x,
        //     p.y,
        //     p.z
        //   );
        //   let regionComponent = new RegionComponent(newRegion, this.renderer);

        //   // region has not been sent to client before
        //   this.regions[p.serial] = new RegionController(this, newRegion, regionComponent);
        // } else {
        //   // update region
        // }
      }
    pause () {}
    resume () {}
    update (delta: number) {}
    render (interpolation: number) {}
    dispose () {}
}