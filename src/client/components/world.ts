/** Services */
import * as server from '../reverieServer';

/** Dependencies */
import { Component, EntityComponent, LocationComponent } from './';
import * as Packets from '../../common/data/net/';
import { EntityController } from '../world/entityController';
import { World, WorldLocation } from '../../common/models';
import { WorldRenderer } from '../world/worldRenderer';
import { WorldMapComponent } from './world/worldMap';

export class WorldComponent extends Component {
  worldMap: WorldMapComponent;

  canvas: HTMLCanvasElement;
  bufferCanvas: HTMLCanvasElement;
  renderer: WorldRenderer;
  locationContainer: HTMLElement;
  entityContainer: HTMLElement;
  locations: Dictionary<WorldLocation> = {};
  entities: Dictionary<EntityController> = {};
  components: Component[] = [];

  elapsedTime = 0;

  constructor  () {
    super();
      this.renderer = new WorldRenderer(this);
  }
  connectedCallback () {
      super.connectedCallback();

      // register network events
      server.on('world/status', (p: Packets.Server.WorldStatusPacket) => this.onStatus(p));

      // setup events
      this.addEventListener('mousedown', (e) => {
        if (e.button === 2) this.onMoveStart(e);
      });
      this.addEventListener('mouseup', (e) => {
          if (e.button === 2) this.onMoveEnd(e);
      });
      this.addEventListener('mousemove', (e) => {
          this.onMouseMove(e);
      });
      this.addEventListener('click', (e) => {
        this.dispatchEvent(new CustomEvent('world-click', {
          detail: e
        }));
      });
  }

  get template () {
    return `
    <style>
      world {
        position: relative;
        display: block;
        width: 120px;
        height: 120px;
      }
    </style>
    `;
  }

  update (delta: number) {
    this.elapsedTime += delta;
    // if (this.agentMoving && this.elapsedTime - this.lastMove > 200) {
    //     this.server.emit('move', this.parseMouseDirection(this.currentMouse.x, this.currentMouse.y));
    //     this.lastMove = this.elapsedTime;
    // }
    this.renderer.update(delta);
  }

  status: Packets.Server.WorldStatusPacket;
  onStatus (worldStatus: Packets.Server.WorldStatusPacket) {
    console.log(worldStatus);
    // if world doesn't exist, create it
    if (!this.worldMap) {
      this.worldMap = new WorldMapComponent(
        worldStatus.seed,
        worldStatus.width,
        worldStatus.height,
        worldStatus.state,
        worldStatus.createdAt
      );
      this.shadow.appendChild(this.worldMap);
    }
    this.worldMap.elapsedTime = worldStatus.elapsedTime;
    this.worldMap.land = worldStatus.land;
    this.worldMap.elevation = worldStatus.elevation;
    this.worldMap.hydrology = worldStatus.hydrology;
    this.worldMap.temperature = worldStatus.temperature;
    this.worldMap.regions = worldStatus.regions;
  }
  getLocationComponent (serial: string) {
      for (let l of this.components) {
          if (l.serial === serial) return l;
      }
  }
  addLocationComponent (location: WorldLocation) {
      if (this.locations[location.serial]) return;

      this.locations[location.serial] = location;
      let lComponent = new LocationComponent(location, this.renderer);
      this.components.push(lComponent);
      this.locationContainer.appendChild(lComponent);
      return lComponent;
  }
  addEntityComponent (entity: EntityController) {
      let eComponent;
      // check if component for entity already exists
      for (let c of this.components) {
          if (c.serial === entity.serial) eComponent = <EntityComponent>c;
      }

      // create component
      if (!eComponent) {
          this.entities[entity.serial] = entity;
          eComponent = new EntityComponent(entity, this.renderer);
          this.components.push(eComponent);
          this.entityContainer.appendChild(eComponent);
      }
      return eComponent;
  }
  removeEntityComponent (serial: string) {
      for (let c of this.components) {
          if ((<EntityComponent>c).entity.serial === serial) c.remove();
      }
  }

  onEntityCreate (p: Packets.Server.EntityCreatePacket) {
    let e = p.entity;
    this.entities[e.serial] = new EntityController(this, e);
  }
  onEntityChat (p: Packets.Server.EntityChatPacket) {
    console.log(p);
    // let e = this.getEntityBySerial(from);
    // if (!e) return;
    // e.entity.speak(speech);
  }
  onEntityMove(p: Packets.Server.EntityPositionPacket) {
    console.log(p);
    // let movedAgent = this.getEntityBySerial(entity.serial);
    // if (!movedAgent) movedAgent = this.createEntity(entity);
    // movedAgent.moveTo(entity.position);
  }
  onEntityRemove (p: Packets.Server.EntityRemovePacket) {
    console.log(p);

    let entity = this.entities[p.serial];
    if (entity) {
      entity.component.remove();
      delete this.entities[p.serial];
    }
  }

  // Location based functions
  isLocation(x: number, y: number) {
    return x >= 0 && x < this.worldMap.width && y >= 0 && y < this.worldMap.height;
  }

  // Entity based functions
  lastMove: number = 0;
  clientIsMoving: boolean = false;
  currentMouse: {x: number, y: number} = {x: 0, y: 0};
  onMoveStart (e: MouseEvent) {
    this.clientIsMoving = true;
    this.currentMouse.x = e.x;
    this.currentMouse.y = e.y;
  }
  onMoveEnd(e: MouseEvent) {
    this.clientIsMoving = false;
    this.currentMouse.x = e.x;
    this.currentMouse.y = e.y;
  }
  onMouseMove (e: MouseEvent) {
    this.currentMouse.x = e.x;
    this.currentMouse.y = e.y;
  }
  parseMouseDirection (x: number, y: number) {
    let direction = '';

    if (this.isNorth(x, y)) direction += 'n';
    if (this.isEast(x, y)) direction += 'e';
    if (this.isWest(x, y)) direction += 'w';
    if (this.isSouth(x, y)) direction += 's';
    return direction;
  }
  getTheta (x: number, y: number) {
    // translate around origin
    x = x - this.center.x;
    y = y - this.center.y;
    // get angle
    let rad = Math.atan2(-1, 1) - Math.atan2(x, y);
    rad =  rad * 360 / (2 * Math.PI);
    if (rad < 0) rad += 360;
    return rad;
  }
  isNorth(x: number, y: number) {
    let theta = this.getTheta(x, y);
    return  theta >= 30 && theta <= 175;
  }
  isEast(x: number, y: number) {
    let theta = this.getTheta(x, y);
    return theta >= 110 && theta <= 245;
  }
  isWest(x: number, y: number) {
    let theta = this.getTheta(x, y);
    return theta >= 0 && theta <= 55
        || theta >= 280 && theta <= 360;
  }
  isSouth(x: number, y: number) {
    let theta = this.getTheta(x, y);
    return theta >= 225 && theta <= 315;
  }
}
customElements.define('reverie-world', WorldComponent);