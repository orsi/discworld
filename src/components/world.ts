import Component from './component';
import WorldOverview from './world/worldOverview';
import Entity from './entity';
import Location from './location';
import EntityController from '../world/entityController';
import { default as WorldModel } from '../models/world';
import WorldLocation from '../models/location';
import WorldRenderer from '../world/worldRenderer';
import { BIOMES } from '../data/static/biomes';
import Point2D from '../data/point2d';
import Point3D from '../data/point3d';

export default class World extends Component {
  canvas: HTMLCanvasElement = document.createElement('canvas');
  mainContext: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  buffer: HTMLCanvasElement = document.createElement('canvas');
  bufferContext: CanvasRenderingContext2D = this.buffer.getContext('2d')!;
  overview: WorldOverview;
  renderer: WorldRenderer;
  locations: { [key: string]: WorldLocation } = {};
  entities: { [key: string]: EntityController } = {};
  components: Component[] = [];

  elapsedTime = 0;

  lastMove: number = 0;
  clientIsMoving: boolean = false;
  currentMouse: { x: number, y: number } = { x: 0, y: 0 };
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();

    // setup events
    this.addEventListener('mousewheel', (e) => this.onZoom(e as WheelEvent));
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
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.renderer = new WorldRenderer(this, window.innerWidth, window.innerHeight);
    this.renderer.setSize(this.width, this.height);
    this.shadow.appendChild(this.canvas);
  }

  get template() {
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
  update(delta: number) {
    this.elapsedTime += delta;
    if (this.clientIsMoving && this.elapsedTime - this.lastMove > 16) {
      if (this.isNorth(this.currentMouse.x, this.currentMouse.y)) {
        this.pixelOffset.x--;
        this.pixelOffset.y++;
      }
      if (this.isEast(this.currentMouse.x, this.currentMouse.y)) {
        this.pixelOffset.x--;
        this.pixelOffset.y--;
      }
      if (this.isSouth(this.currentMouse.x, this.currentMouse.y)) {
        this.pixelOffset.x++;
        this.pixelOffset.y--;
      }
      if (this.isWest(this.currentMouse.x, this.currentMouse.y)) {
        this.pixelOffset.x++;
        this.pixelOffset.y++;
      }
      this.lastMove = this.elapsedTime;
      this.rendered = false;
    }

    if (this.overview) this.overview.update(delta);
    if (this.renderer) this.renderer.update(delta);
    if (this.model) this.renderMainContext(this.bufferContext);
  }
  model: WorldModel;
  origin: Point3D = new Point3D(0, 0, 0);
  pixelOffset: Point2D = new Point2D(0, 0);

  setWorldData(p: any) {
    // if world doesn't exist, create it
    if (!this.model) this.model = new WorldModel();
    this.model = p.world;

    this.overview = new WorldOverview(this.model);
    this.shadow.appendChild(this.overview);

    this.origin.x = this.model.width / 2;
    this.origin.y = this.model.height / 2;
    this.origin.z = 128;

    this.buffer.width = this.model.width * this.TILE_SIZE + this.model.height * this.TILE_SIZE;
    this.buffer.height = this.model.height * this.TILE_SIZE + this.model.width * (this.TILE_SIZE / 2);
    this.draw(this.bufferContext);
  }

  getLocationComponent(serial: string) {
    for (let l of this.components) {
      if (l.serial === serial) return l;
    }
  }

  addLocationComponent(location: WorldLocation) {
    if (this.locations[location.serial]) return;

    this.locations[location.serial] = location;
    let lComponent = new Location(location, this.renderer);
    this.components.push(lComponent);
    // this.locationContainer.appendChild(lComponent);
    return lComponent;
  }
  addEntityComponent(entity: EntityController) {
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
  removeEntityComponent(serial: string) {
    for (let c of this.components) {
      if ((<Entity>c).entity.serial === serial) c.remove();
    }
  }

  onEntityRemove(p: any) {
    console.log(p);

    let entity = this.entities[p.serial];
    if (entity) {
      entity.component.remove();
      delete this.entities[p.serial];
    }
  }

  isLocation(x: number, y: number) {
    return x >= 0 && x < this.model.width && y >= 0 && y < this.model.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let y = 0; y < this.model.height; y++) {
      for (let x = 0; x < this.model.width; x++) {
        let location = this.model.map[x][y];
        if (!location.land) continue;

        // colour
        let fill = `#171717`;
        switch (location.biome) {
          case BIOMES.VOID:
            fill = `#171717`;
            break;
          case BIOMES.TUNDRA:
            fill = `#b3b5d8`;
            break;
          case BIOMES.DESERT:
            fill = `#ebae87`;
            break;
          case BIOMES.FOREST:
            fill = `#24561e`;
            break;
          case BIOMES.GRASSLAND:
            fill = `#34b30b`;
            break;
          case BIOMES.HEATHLAND:
            fill = `#2a83c3`;
            break;
          case BIOMES.SAVANNA:
            fill = `#b33839`;
            break;
          case BIOMES.MIRE:
            fill = `#187a65`;
            break;
          case BIOMES.RIVER:
            fill = `#348d9f`;
            break;
          case BIOMES.LAKE:
            fill = `#184464`;
            break;
          case BIOMES.SEA:
            fill = `#082a42`;
            break;
          case BIOMES.HILLS:
            fill = `#13b569`;
            break;
          case BIOMES.MOUNTAINS:
            fill = `#915143`;
            break;
        }
        ctx.fillStyle = fill;

        // elevation
        let drawElevation = location.elevation;
        if (location.biome === BIOMES.RIVER
          || location.biome === BIOMES.LAKE
          || location.biome === BIOMES.SEA) drawElevation = 64;

        // draw
        const point = this.getPoint(location.x, location.y, drawElevation);
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x + this.TILE_SIZE, point.y + (this.TILE_SIZE / 2));
        ctx.lineTo(point.x, point.y + this.TILE_SIZE);
        ctx.lineTo(point.x - this.TILE_SIZE, point.y + (this.TILE_SIZE / 2));
        ctx.fill();
      }
    }
  }
  renderMainContext(ctx: CanvasRenderingContext2D) {
    this.mainContext.clearRect(0, 0, this.mainContext.canvas.width, this.mainContext.canvas.height);

    const originPoint = this.getPoint(this.origin.x, this.origin.y, this.origin.z);
    const wView = this.mainContext.canvas.width * this.zoomFactor;
    const hView = this.mainContext.canvas.height * this.zoomFactor;

    this.mainContext.drawImage(ctx.canvas,
      originPoint.x - this.pixelOffset.x - (wView / 2),
      originPoint.y - this.pixelOffset.y - (hView / 2),
      wView,
      hView,
      0,
      0,
      this.mainContext.canvas.width,
      this.mainContext.canvas.height
    );
  }
  TILE_SIZE = 12;
  getPoint(x: number, y: number, z: number) {
    let pixelX = x * this.TILE_SIZE - y * this.TILE_SIZE + (this.origin.x * this.TILE_SIZE + this.origin.y * this.TILE_SIZE);
    let pixelY = y * (this.TILE_SIZE / 2) + x * (this.TILE_SIZE / 2) - z * (this.TILE_SIZE / 4);
    return new Point2D(pixelX, pixelY);
  }
  getLocationAtPixel(x: number, y: number) {
    let lx = Math.floor(x / this.TILE_SIZE);
    if (lx > this.model.width) lx = this.model.width;
    if (lx < 0) lx = 0;
    let ly = Math.floor(y / this.TILE_SIZE);
    if (ly > this.model.height) ly = this.model.height;
    if (ly < 0) ly = 0;
    return this.model.map[lx][ly];
  }
  zoomFactor = 6;
  onZoom(e: WheelEvent) {
    if (e.deltaY > 0 && this.zoomFactor > .2) {
      this.zoomFactor = this.zoomFactor - .1;
    } else if (e.deltaY < 0 && this.zoomFactor < 6) {
      this.zoomFactor = this.zoomFactor + .1;
    }

    // normalize
    if (this.zoomFactor < .1) this.zoomFactor = 0.1;
    if (this.zoomFactor > 6) this.zoomFactor = 6;

    // chop off excess digits
    this.zoomFactor = parseFloat(this.zoomFactor.toFixed(2));
    console.log(this.zoomFactor, this.origin, this.pixelOffset);
  }
  onMoveStart(e: MouseEvent) {
    this.clientIsMoving = true;
    this.currentMouse.x = e.x;
    this.currentMouse.y = e.y;
  }
  onMoveEnd(e: MouseEvent) {
    this.clientIsMoving = false;
    this.currentMouse.x = e.x;
    this.currentMouse.y = e.y;
  }
  onMouseMove(e: MouseEvent) {
    this.currentMouse.x = e.x;
    this.currentMouse.y = e.y;
  }
  parseMouseDirection(x: number, y: number) {
    let direction = '';

    if (this.isNorth(x, y)) direction += 'n';
    if (this.isEast(x, y)) direction += 'e';
    if (this.isWest(x, y)) direction += 'w';
    if (this.isSouth(x, y)) direction += 's';
    return direction;
  }
  getTheta(x: number, y: number) {
    // translate around origin
    let originX = this.canvas.width / 2;
    let originY = this.canvas.height / 2;
    x = x - originX;
    y = -1 * (y - originY);
    // get angle
    let rad = Math.atan2(x, y);
    rad = rad * 360 / (2 * Math.PI);
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
customElements.define('discworld-world', World);