// Reverie client
// Created by Jonathon Orsi
const EventManager = require('./EventManager');
const InputManager = require('./InputManager');

const Player = require('./Player');
const World = require('./World');
const Network = require('./Network');
const Renderer = require('./Renderer');
const Debug = require('./Debug');

debug = true;
function ReverieClient (env) {
  this.env = env || {};
  this.world;
  this.server;
  this.player = new Player();

  // init socket.io and network
  let socket = io();
  this.Network = new Network(socket);

  // init Input
  this.InputManager = new InputManager();

  // init Renderer
  this.Renderer = Renderer.init(document.querySelector('#reverie'));

  // debugger
  if (debug) this.Debug = Debug.init();

  // register events
  this.events = EventManager.register('reverie');
  this.events.on('server/connect', (server) => {
    this.server = server;
  });
  this.events.on('world/init', (world) => {
    this.world = new World(world);
  });


  this.update();
}
ReverieClient.prototype.update = function () {
  if(this.player && this.world) {
    this.Renderer.render({
      entity: this.player.get('entity'),
      world: this.world.get('world'),
      debug: this.world.get('debug')
    });
    if (this.Debug) {
      this.Debug.output({
        delta: this.Renderer.get('delta'),
        view: this.Renderer.get('view'),
        world: this.world.get('world'),
        entity: this.player.get('entity')
      })
    }
  }
  requestAnimationFrame(() => this.update());
}

// init ReverieClient
let reverie = new ReverieClient();
