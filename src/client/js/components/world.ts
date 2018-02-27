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
  canvas: HTMLCanvasElement = document.createElement('canvas');
  ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  overview: WorldOverview;
  renderer: WorldRenderer;
  locations: Dictionary<WorldLocation> = {};
  entities: Dictionary<EntityController> = {};
  components: Component[] = [];

  elapsedTime = 0;

  lastMove: number = 0;
  clientIsMoving: boolean = false;
  currentMouse: {x: number, y: number} = {x: 0, y: 0};
  constructor  () {
    super();
  }
  connectedCallback () {
      super.connectedCallback();

      // setup events
      this.addEventListener('mousewheel', (e) => this.onZoom(e));
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
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.rendered = false;
      });

      this.renderer = new WorldRenderer(this, window.innerWidth, window.innerHeight);
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
      canvas {
        overflow: visible;
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    </style>
    `;

    return style;
  }

  rendered = false;
  update (delta: number) {
    this.elapsedTime += delta;
    // if (this.agentMoving && this.elapsedTime - this.lastMove > 200) {
    //     this.server.emit('move', this.parseMouseDirection(this.currentMouse.x, this.currentMouse.y));
    //     this.lastMove = this.elapsedTime;
    // }

    // input
    let now = new Date().getTime();
    if (this.clientIsMoving && now - this.lastMove > 120) {
      let originX = this.renderer.originPixel.x;
      let originY = this.renderer.originPixel.y;
      if (this.isNorth(this.currentMouse.x, this.currentMouse.y)) {
        originX--;
        originY++;
      }
      if (this.isEast(this.currentMouse.x, this.currentMouse.y)) {
        originX--;
        originY--;
      }
      if (this.isSouth(this.currentMouse.x, this.currentMouse.y)) {
        originX++;
        originY--;
      }
      if (this.isWest(this.currentMouse.x, this.currentMouse.y)) {
        originX++;
        originY++;
      }
      this.renderer.setPixelOrigin(originX, originY);
      this.rendered = false;
      this.lastMove = now;
    }

    this.renderer.update(delta);
    if (this.model && !this.rendered) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
              fill = `rgba(0,0,81,1)`;
              break;
            case BIOMES.LAKE:
              fill = `rgba(0,0,201,1)`;
              break;
            case BIOMES.SEA:
              fill = `rgba(0,0,148,1)`;
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
            let blockSize = this.renderer.getTileSize();
            this.ctx.fillStyle = fill;
            this.ctx.beginPath();
            this.ctx.moveTo(pixel.x, pixel.y);
            this.ctx.lineTo(pixel.x + blockSize, pixel.y + (blockSize / 2));
            this.ctx.lineTo(pixel.x, pixel.y + blockSize);
            this.ctx.lineTo(pixel.x - blockSize, pixel.y + (blockSize / 2));
            this.ctx.fill();
          }
        }
      }
      this.overview.update(delta);
      this.rendered = true;
    }
  }
  model: WorldModel;
  setWorldData (p: WorldDataPacket) {
    // if world doesn't exist, create it
    if (!this.model) this.model = new WorldModel();
    this.model = p.world;

    this.renderer.setWorldOrigin(this.model.width / 2, this.model.height / 2, 128);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.shadow.appendChild(this.canvas);

    this.overview = new WorldOverview(this.model);
    this.shadow.appendChild(this.overview);
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

  onZoom (e: MouseWheelEvent) {
    console.log(e.wheelDelta, e.wheelDeltaX, e.wheelDeltaY);
    if (e.wheelDelta > 0) {
      this.renderer.zoomIn();
      this.rendered = false;
    } else {
      this.renderer.zoomOut();
      this.rendered = false;
    }
  }
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
    let originX = this.canvas.width / 2;
    let originY = this.canvas.height / 2;
    x = x - originX;
    y = -1 * (y - originY);
    // get angle
    let rad = Math.atan2(x, y);
    rad =  rad * 360 / (2 * Math.PI);
    if (rad < 0) rad += 360;
    return rad;
  }
  isNorth(x: number, y: number) {
    let cornerX = this.canvas.width;
    let cornerY = 0;
    let cornerTheta = this.getTheta(cornerX, cornerY);
    let max = cornerTheta + 80;
    let min = cornerTheta - 80;
    let theta = this.getTheta(x, y);
    return theta >= min && theta <= max;
  }
  isEast(x: number, y: number) {
    let cornerX = this.canvas.width;
    let cornerY = this.canvas.height;
    let cornerTheta = this.getTheta(cornerX, cornerY);
    let max = cornerTheta + 80;
    let min = cornerTheta - 80;
    let theta = this.getTheta(x, y);
    return theta >= min && theta <= max;
  }
  isSouth(x: number, y: number) {
    let cornerX = 0;
    let cornerY = this.canvas.height;
    let cornerTheta = this.getTheta(cornerX, cornerY);
    let max = cornerTheta + 80;
    let min = cornerTheta - 80;
    let theta = this.getTheta(x, y);
    return theta >= min && theta <= max;
  }
  isWest(x: number, y: number) {
    let cornerX = 0;
    let cornerY = 0;
    let cornerTheta = this.getTheta(cornerX, cornerY);
    let max = cornerTheta + 80;
    let min = cornerTheta - 80;
    let theta = this.getTheta(x, y);
    return theta >= min && theta <= max;
  }
}
customElements.define('reverie-world', World);