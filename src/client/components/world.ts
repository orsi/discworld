/** Services */
import * as server from '../reverieServer';

/** Dependencies */
import { Component } from './component';
import { Entity, Location } from './';
import * as Packets from '../../common/data/net/';
import { EntityController } from '../world/entityController';
import { World as WorldModel, WorldLocation } from '../../common/models';
import { WorldRenderer } from '../world/worldRenderer';
import { WorldMapComponent } from './world/worldMap';

export default class World extends Component {
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

  TILE_WIDTH = 12;
  get template () {
    const style = `
    <style>
      :host {
        position: absolute;
        display: block;
        top: 50%;
        left: 50%;
        text-align: center;
      }
      svg {
        overflow: visible;
        display: inline-block;
      }
    </style>
    `;

    let content = '';
    if (this.model) {
      content = `
        <svg>
          <g>
      `;
      for (let y = 0; y < this.model.height; y++) {
        for (let x = 0; x < this.model.width; x++) {
          let land = this.model.land[x + (y * this.model.width)];
          let elevation = this.model.elevation[x + (y * this.model.width)];
          let temperature = this.model.temperature[x + (y * this.model.width)] * 128;
          let hydrology = this.model.hydrology[x + (y * this.model.width)] * 128;
          let stroke = `#${temperature.toString(16).slice(0, 2)}00${hydrology.toString(16).slice(0, 2)}`;
          let fill = `#${temperature.toString(16).slice(0, 2)}00${hydrology.toString(16).slice(0, 2)}`;
          if (land) content += `
            <path
              fill="${fill}"
              stroke="${stroke}"
              d="
                M${(x * this.TILE_WIDTH) - (y * this.TILE_WIDTH)},
                  ${(y * this.TILE_WIDTH / 2) + (x * this.TILE_WIDTH / 2) - (elevation)}
                l${this.TILE_WIDTH},${this.TILE_WIDTH / 2}
                l${-(this.TILE_WIDTH)},${this.TILE_WIDTH / 2}
                l${-(this.TILE_WIDTH)},${-(this.TILE_WIDTH / 2)}
                Z"
              fill-opacity="1"
              stroke-width="1"></path>
          `;
        }
      }
      content += `</g></svg>`;
    }

    return style + content;
  }

  update (delta: number) {
    this.elapsedTime += delta;
    // if (this.agentMoving && this.elapsedTime - this.lastMove > 200) {
    //     this.server.emit('move', this.parseMouseDirection(this.currentMouse.x, this.currentMouse.y));
    //     this.lastMove = this.elapsedTime;
    // }
    this.renderer.update(delta);
  }
  model: WorldModel;
  setWorldData (p: Packets.Server.WorldDataPacket) {
    console.log(p);
    // if world doesn't exist, create it
    if (!this.model) this.model = new WorldModel();
    this.model.seed = p.seed;
    this.model.width = p.width;
    this.model.height = p.height;
    this.model.createdAt = p.createdAt;
    this.model.land = p.land;
    this.model.elevation = p.elevation;
    this.model.hydrology = p.hydrology;
    this.model.temperature = p.temperature;

    this.stateChange = true;
    this.render();
  }
  getLocationComponent (serial: string) {
      for (let l of this.components) {
          if (l.serial === serial) return l;
      }
  }
  addLocationComponent (location: WorldLocation) {
      if (this.locations[location.serial]) return;

      this.locations[location.serial] = location;
      let lComponent = new Location(location, this.renderer);
      this.components.push(lComponent);
      this.locationContainer.appendChild(lComponent);
      return lComponent;
  }
  addEntityComponent (entity: EntityController) {
      let eComponent;
      // check if component for entity already exists
      for (let c of this.components) {
          if (c.serial === entity.serial) eComponent = <Entity>c;
      }

      // create component
      if (!eComponent) {
          this.entities[entity.serial] = entity;
          eComponent = new Entity(entity, this.renderer);
          this.components.push(eComponent);
          this.entityContainer.appendChild(eComponent);
      }
      return eComponent;
  }
  removeEntityComponent (serial: string) {
      for (let c of this.components) {
          if ((<Entity>c).entity.serial === serial) c.remove();
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
customElements.define('reverie-world', World);