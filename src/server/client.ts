/** Services */
import * as network from './services/network';
import * as events from './services/events';
import * as reverie from './reverie';

import { Packet } from '../common/data/net/packet';
import * as Packets from '../common/data/net';
import { Entity } from '../common/models';
import { DIRECTION } from '../common/data/static';

export class Client {
    socket: SocketIO.Socket;
    entity: Entity;
    constructor (socket: SocketIO.Socket) {
        this.socket = socket;

        // socket.on('client/message', (p: Packets.Client.Message) => this.onChat(p));
        socket.on('move', (p: Packets.Client.Move) => this.onMove(p));
        socket.on('interact', (p: Packets.Client.Interact) => this.onInteract(p));
        socket.on('focus', (p: Packets.Client.Focus) => this.onFocus(p));
    }
    send (packet: Packet) {
        this.socket.emit(packet.event, packet);
    }

    // incoming packets
    // onChat (p: Packets.Client.Message) {
    //     console.log(p);
    //     let message = p.message;
    //     let isCommand = message.substring(0, 1) === '/';

    //     if (isCommand) {
    //         // let command = speech.split(' ');
    //         // switch (command[0]) {
    //         //   case '/generate':
    //         //     this.onCreate();
    //         //     break;
    //         //   case '/destroy':
    //         //     this.destroy();
    //         //     break;
    //         //   case '/move':
    //         //     if (!client.entity) return;
    //         //     let x, y;
    //         //     if (command[1]) x = parseInt(command[1]);
    //         //     if (command[2]) y = parseInt(command[2]);

    //         //     if (x && y && !isNaN(x) && !isNaN(y)) {
    //         //       let location = this.maps.getLocation(x, y);
    //         //       if (!location) return;

    //         //       client.entity.moveTo(location);
    //         //       let map = this.maps.getRegionAt(location.x, location.y);
    //         //       map.forEach(location => client.send('world/location', location));

    //         //       // send client locations to clients in range
    //         //       for (let serial in this.clients) {
    //         //         let to = this.clients[serial];
    //         //         if (this.maps.isLocationInRegion(to.entity.location, client.entity.location)) {
    //         //           to.send('entity/move', client.entity);
    //         //           client.send('entity/move', to.entity);
    //         //         }
    //         //       }
    //         //     }
    //         //     break;
    //         //   default:
    //         //     break;
    //         // }
    //     } else {
    //         // if (!client.entity) return;
    //         // client.entity.speak(speech);
    //         // // send speech to all clients in region
    //         // for (let serial in this.clients) {
    //         //   let to = this.clients[serial];
    //         //   if (this.regions.isPositionInRegion(to.entity.position, client.entity.position)) {
    //         //     to.send('entity/speech', client.entity.serial, speech);
    //         //     console.log(`sent entity/speech '${speech}' to ${to.serial}`);
    //         //   }
    //         // }
    //     }
    // }
    /**
     * Moves client to a new position if possible and sends
     * new position information to client and all clients
     * in range. Also sends new region information if
     * client is approaching the edges of the region they
     * are currently in.
     * @param client The client requesting to move
     * @param data The direction of move
     */
    onMove (p: Packets.Client.Move) {
        let nextPosition = this.parsePosition(this.entity.x, this.entity.y, p.direction);

        // return if entity can't move to position
        // if (!nextPosition || !reverie.getWorld().canMoveToPosition(nextPosition.x, nextPosition.y)) return;

        // send new position to entity
        // client.entity.moveTo(nextPosition);
        // client.send('entity/move', client.entity);

        // // send new client position to clients in range
        // for (let serial in this.clients) {
        //   let to = this.clients[serial];
        //   if (to.serial !== client.serial
        //       && this.regions.isPositionInRegion(to.entity.position, client.entity.position)) {
        //     to.send('entity/move', client.entity);
        //   }
        // }

        // see if entity is moving close enough to a new region
        // let region = this.controller.getRegionAt(nextPosition.x, nextPosition.y);
        // client.send('world/region', nextPosition);
    }
    parsePosition (x: number, y: number, direction: DIRECTION) {
        switch (direction) {
            case DIRECTION.NORTH:
                y--;
                break;
            case DIRECTION.NORTH_EAST:
                x++;
                y--;
                break;
            case DIRECTION.EAST:
                x++;
                break;
            case DIRECTION.SOUTH_EAST:
                x++;
                y++;
                break;
            case DIRECTION.SOUTH:
                y++;
                break;
            case DIRECTION.SOUTH_WEST:
                x--;
                y++;
                break;
            case DIRECTION.WEST:
                x--;
                break;
            case DIRECTION.NORTH_WEST:
                x--;
                y--;
                break;
        }
        // let position = reverie.getWorld().getPosition(x, y);
        // return position;
    }
    onInteract (p: Packets.Client.Interact) {
        // get entity
        // get object entity wants to interact with
        // check if entity cna interact with it
        // if entity can, perform interaction with object
        // if entity can't, reject
    }
    onFocus (p: Packets.Client.Focus) {
        // get entity
        // get object entity wants to focus
        // check if entity can focus on object
        // return information if entity can focus on it
    }
}