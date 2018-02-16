/** Services */
import * as server from '../reverieServer';

/** Dependencies */
import Component from './component';
import WorldOverview from './world/worldOverview';
import Entity from './entity';
import Location from './location';

import EntityMovePacket from '../../../common/data/net/server/entityMove';
import EntityMessagePacket from '../../../common/data/net/server/entityMessage';
import EntityRemovePacket from '../../../common/data/net/server/entityRemove';
import WorldDataPacket from '../../../common/data/net/server/worldData';

import EntityController from '../world/entityController';
import { default as WorldModel } from '../../../common/models/world';
import WorldLocation from '../../../common/models/location';
import WorldRenderer from '../world/worldRenderer';
import { BIOMES } from '../../../common/data/static/biomes';

export default class World extends Component {
  renderer: WorldRenderer;
  locations: Dictionary<WorldLocation> = {};
  entities: Dictionary<EntityController> = {};
  components: Component[] = [];

  elapsedTime = 0;

  constructor  () {
    super();
      this.renderer = new WorldRenderer(this);

      let width = window.innerWidth;
      let height = window.innerHeight;
      this.renderer.setSize(width, height);
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
      window.addEventListener('resize', (e) => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.renderer.setSize(width, height);
      });
  }

  TILE_WIDTH = 12;
  get template () {
    const style = `
    <style>
      :host {
        position: absolute;
        display: block;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
      svg {
        overflow: visible;
        display: inline-block;
        width: 100%;
        height: 100%;
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
          let location = this.model.map[x][y];
          if (!location.land) continue;

          let fill = `rgba(0,0,0,0)`;
          switch (location.biome) {
            case BIOMES.VOID:
              fill = `rgba(10,10,10,1)`;
              break;
            case BIOMES.TUNDRA:
              fill = `rgba(230,230,230,1)`;
              break;
            case BIOMES.DESERT:
              fill = `rgba(93,79,69,1)`;
              break;
            case BIOMES.FOREST:
              fill = `rgba(34,139,34,1)`;
              break;
            case BIOMES.GRASSLAND:
              fill = `rgba(124,252,0,1)`;
              break;
            case BIOMES.HEATHLAND:
              fill = `rgba(138,43,226,1)`;
              break;
            case BIOMES.SAVANNA:
              fill = `rgba(210,129,86,1)`;
              break;
            case BIOMES.MIRE:
              fill = `rgba(62,68,60,1)`;
              break;
            case BIOMES.RIVER:
              fill = `rgba(23,70,81,1)`;
              break;
            case BIOMES.LAKE:
              fill = `rgba(104,120,201,1)`;
              break;
            case BIOMES.SEA:
              fill = `rgba(0,105,148,1)`;
              break;
            case BIOMES.HILLS:
              fill = `rgba(102,204,0,1)`;
              break;
            case BIOMES.MOUNTAINS:
              fill = `rgba(150,141,153,1)`;
              break;
          }
          let drawElevation = location.elevation;
          if (location.biome === BIOMES.RIVER
            || location.biome === BIOMES.LAKE
            || location.biome === BIOMES.SEA) drawElevation = 64;
          if (this.renderer.isOnScreen(x, y, drawElevation)) {
            let pixel = this.renderer.mapWorldLocationToPixel(x, y, drawElevation);
            content += `
            <path
              fill="${fill}"
              data-x="${x}"
              data-y="${y}"
              data-biome="${location.biome}"
              data-elevation="${location.elevation}"
              data-temperature="${location.temperature}"
              data-precipitation="${location.precipitation}"
              d="
                M${pixel.x},${pixel.y}
                l${this.renderer.BLOCK_SIZE},${this.renderer.BLOCK_SIZE / 2}
                l${-(this.renderer.BLOCK_SIZE)},${this.renderer.BLOCK_SIZE / 2}
                l${-(this.renderer.BLOCK_SIZE)},${-(this.renderer.BLOCK_SIZE / 2)}
                Z"
              fill-opacity="1"></path>
          `;
          }
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
  setWorldData (p: WorldDataPacket) {
    // if world doesn't exist, create it
    if (!this.model) this.model = new WorldModel();
    this.model = p.world;

    this.renderer.setWorldOrigin(this.model.width / 2, this.model.height / 2, 128);

    this.stateChange = true;
    this.render();
    this.shadow.appendChild(new WorldOverview(this.model));
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
      // this.locationContainer.appendChild(lComponent);
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
          // this.entityContainer.appendChild(eComponent);
      }
      return eComponent;
  }
  removeEntityComponent (serial: string) {
      for (let c of this.components) {
          if ((<Entity>c).entity.serial === serial) c.remove();
      }
  }

  onEntityChat (p: EntityMessagePacket) {
    console.log(p);
    // let e = this.getEntityBySerial(from);
    // if (!e) return;
    // e.entity.speak(speech);
  }
  onEntityMove(p: EntityMovePacket) {
    console.log(p);
    // let movedAgent = this.getEntityBySerial(entity.serial);
    // if (!movedAgent) movedAgent = this.createEntity(entity);
    // movedAgent.moveTo(entity.position);
  }
  onEntityRemove (p: EntityRemovePacket) {
    console.log(p);

    let entity = this.entities[p.serial];
    if (entity) {
      entity.component.remove();
      delete this.entities[p.serial];
    }
  }

  // Location based functions
  isLocation(x: number, y: number) {
    return x >= 0 && x < this.model.width && y >= 0 && y < this.model.height;
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
    x = x - this.clientWidth / 2;
    y = y - this.clientHeight / 2;
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