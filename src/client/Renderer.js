var view, canvas, buffer;
var lastRender = new Date();
var delta = 0;
var worldLoaded = false;
module.exports = {
  init: function (container) {
    view = new View(window.innerWidth, window.innerHeight);
    canvas = new Canvas(view.width, view.height);
    buffer = new Canvas(view.width, view.height);

    container.appendChild(canvas.element);
    return this;
  },
  get: function (type) {
    switch (type) {
      case 'view':
        return view;
      case 'canvas':
        return canvas;
      case 'buffer':
        return buffer;
      case 'delta':
        return delta;
    }
  },
  move: function (x, y) {
    // move offset relative to scale size
    // so that it doesn't become slow when
    // zoomed in
    view.offset.x -= Math.floor(x * view.zoom * view.minSize / 2);
    view.offset.y -= Math.floor(y * view.zoom * view.minSize / 2);
  },
  resize: function () {
    view.width = buffer.element.width = canvas.element.width = window.innerWidth;
    view.height = buffer.element.height = canvas.element.height = window.innerHeight;

    view.center.x = Math.floor(view.width / 2);
    view.center.y = Math.floor(view.height / 2);
  },
  render: function (state) {
    var now = new Date();
    delta = now.getTime() - lastRender.getTime();
    lastRender = now;

    // clear buffer and canvas
    buffer.clear();
    canvas.clear();

    // draw to buffer
    if (state.world) {
      buffer.drawWorldMap(state.world);
    }
    if (state.regions) {
      for (let region of state.regions) {
        region.render(buffer.ctx, view);
      }
    }
    if (state.entity) {
      view.follow(state.entity['position'].x, state.entity['position'].y, state.entity['position'].z);
      buffer.drawPlayerEntity(state.entity);
    }
    if (state.entities) {
      state.entities.forEach(function (entity) {
        entity.render(buffer.ctx, view);
      });
    }
    if (state.debug) {
      // console.log(state.debug.cells)
      if (state.debug) buffer.drawDebugMaps(state.debug)
    }

    // switch to canvas
    swap();
  }
};

function Canvas () {
  this.element = document.createElement('canvas');
  this.ctx = this.element.getContext('2d');
  this.width = this.element.width = window.innerWidth;
  this.height = this.element.height = window.innerHeight;
}
Canvas.prototype.clear = function () {
  this.ctx.clearRect(0,0, this.element.width, this.element.height);
}
Canvas.prototype.drawPlayerEntity = function (entity) {
  let canvasPosition = view.worldToCanvas(
    entity['position'].x,
    entity['position'].y,
    entity['position'].z
  );
  let widthOffset = entity['transform'].width / 2;
  this.ctx.fillStyle = 'rgba(150,150,200,.8)';
  this.ctx.fillRect(
    canvasPosition.x - view.offset.x - widthOffset, 
    canvasPosition.y - view.offset.y - entity['transform'].height, 
    entity['transform'].width, 
    entity['transform'].height
  );
}
Canvas.prototype.drawEntities = function (entities) {
  for (let e of entities) {
    let canvasPosition = view.worldToCanvas(
      e['position'].x,
      e['position'].y,
      e['position'].z
    );
    let widthOffset = e['transform'].width / 2;
    this.ctx.fillStyle = 'rgba(150,150,200,.8)';
    this.ctx.fillRect(
      canvasPosition.x - view.offset.x - widthOffset, 
      canvasPosition.y - view.offset.y - e['transform'].height, 
      e['transform'].width, 
      e['transform'].height
    );
  }
}
Canvas.prototype.drawDebugMaps = function (maps) {
  let mx = my = mz = 32;
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      for (let z = 0; z < 32; z++) {
        let canvasPosition = view.worldToCanvas(x, y, z);
        canvasPosition.x -= view.offset.x;
        canvasPosition.y -= view.offset.y;

        let cellMap;
        for (let i = 0; i < maps.cells.length; i++) {
          if (maps.cells[i].z === z) cellMap = maps.cells[i];
        }
        if (view.isOnScreen(canvasPosition.x, canvasPosition.y) && cellMap && cellMap.values[x][y]) {
            let val = maps.temperature[x][y][z];
            let color;
            if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
            if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
            this.ctx.fillStyle = color;

            // console.log(color);
            // console.log(x, y, z);
            // draw bottom face
            this.ctx.beginPath();
            this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
            this.ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
            this.ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.closePath();
            this.ctx.fill();
        }
      }
    }
  }
}
Canvas.prototype.drawCellMap = function (cells) {
  let mx = my = mz = 32;
  for (let i = 0; i < 10; i++) {
    for (let x = 0; x < mx; x++) {
      for (let y = 0; y < my; y++) {
        let canvasPosition = view.worldToCanvas(x, y, cells[i].z);
        canvasPosition.x -= view.offset.x;
        canvasPosition.y -= view.offset.y;
        if (view.isOnScreen(canvasPosition.x, canvasPosition.y) && cells[i].values[x][y]) {
            this.ctx.fillStyle = 'rgba(255,255,255,.5)';

            // console.log(color);
            // console.log(x, y, z);
            // draw bottom face
            this.ctx.beginPath();
            this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
            this.ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
            this.ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.closePath();
            this.ctx.fill();
        }
      }
    }
  }
}
Canvas.prototype.drawWorldMap = function (wm) {
  let mx = my = mz = wm.length;
  for (let x = 0; x < mx; x++) {
    for (let y = 0; y < my; y++) {
      for (let z = 0; z < mz; z++) {
          let canvasPosition = view.worldToCanvas(x, y, z);
          canvasPosition.x -= view.offset.x;
          canvasPosition.y -= view.offset.y;
        if (
          view.isOnScreen(canvasPosition.x, canvasPosition.y)
          && (z == mx - 1 || y == mx - 1 || x == mx - 1) // if any position is toward cam
          ) {
            let val = wm[x][y][z];
            let color;
            if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
            if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
            this.ctx.fillStyle = color;

            // console.log(color);
            // console.log(x, y, z);
            // draw bottom face
            this.ctx.beginPath();
            this.ctx.moveTo(canvasPosition.x, canvasPosition.y);
            this.ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
            this.ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
            this.ctx.closePath();
            this.ctx.fill();
        }
      }
    }
  }
}

function View (width, height) {
  this.top = 0;
  this.left = 0;
  this.width = width;
  this.height = height;
  this.center = {
    x: Math.floor(this.width / 2),
    y: Math.floor(this.height /2)
  }
  this.offset = {
    x: 0,
    y: 0
  };
  this.zoom = 1;
  this.minSize = 12;
  this.blockSize = 32;
}
View.prototype.follow = function(x, y, z) {
  let position = view.worldToCanvas(x, y, z);
  this.centerOn(position.x, position.y);
}
View.prototype.centerOn = function (x, y) {
  this.offset.x = x - this.center.x;
  this.offset.y = y - this.center.y;
}
View.prototype.isOnScreen = function (x, y) {
  // takes canvas positions and sees whether it's in view
  return  x + view.blockSize >= view.left 
          && x - view.blockSize <= view.left + view.width
          && y + view.blockSize >= view.top 
          && y - view.blockSize <= view.top + view.height;
}
View.prototype.isObscured = function (bx, by, bz, maxX, maxY, maxZ, position) {
  // check if there are any blocks directly
  // infront of this from the viewport perspective
  var offsetX = bx + 1;
  var offsetY = by + 1;
  var offsetZ = bz + 1;
  var viewportVisible = true;
  for (var i = 0; offsetX < maxX && offsetY < maxY && offsetZ < maxZ; i++) {
    var block = position[offsetX][offsetY][offsetZ].block;
    if (block !== null) {
      viewportVisible = false;
      break;
    }
    offsetX++;
    offsetY++;
    offsetZ++;
  }

  // check if all neighbours are covering
  // all of this blocks faces
  var neighbourX = bx + 1;
  var neighbourY = by + 1;
  var neighbourZ = bz + 1;
  var faceVisible = true;
  if (
    neighbourX < maxX && 
    neighbourY < maxY && 
    neighbourZ < maxZ &&
    position[neighbourX][by][bz].block !== null &&
    position[bx][neighbourY][bz].block !== null &&
    position[bx][by][neighbourZ].block !== null)
  {
    faceVisisble = false;
  }
  
  // if (bx % 10 === 0 && by % 10 === 0 ) console.log(viewportVisible, faceVisible);
  return viewportVisible && faceVisible;
}
View.prototype.worldToCanvas = function (wx, wy, wz) {
  var cx = ((wx - wy) * view.blockSize / 2);
  var cy = ((wy + wx) * view.blockSize / 4) - (wz * view.blockSize / 2);
  
  // if (position.x % 10 === 0 && position.y % 10 === 0) console.log(position, blockX, blockY, blockZ);
  return {
    x: cx,
    y: cy
  }
}
View.prototype.canvasToWorld = function (canvasPosition) {
  // return world position in center of viewport
  var x = ((canvasPosition.x + canvasPosition.y) * 2 / view.blockSize);
  var y = ((canvasPosition.y - canvasPosition.x) * 4 / view.blockSize);
  
  // if (canvasPosition.x % 10 === 0 && canvasPosition.y % 10 === 0) console.log(x, y);
  return {
    x: Math.floor(x),
    y: Math.floor(y),
  }
}

function swap () {
  // cut the drawn rectangle
  var image = buffer.ctx.getImageData(view.left, view.top, view.width, view.height);
  // copy into visual canvas at different position
  canvas.ctx.putImageData(image, 0, 0);
}

function OLD (world) {
  // have to do translations
  // canvas x, y will be relative to blockSize, scale, center of screen x,y
  for (var x = 0; x < world.x; x++) {
    for (var y = 0; y < world.y; y++) {
      for (var z = 0; z < world.z; z++) {
        // var block = world.regions[x][y][z].block;
        // if (block) {
          var canvasPosition = view.worldToCanvas(world.regions[x][y][z].position);

          // adjust offset of viewport
          canvasPosition.x -= view.offset.x;
          canvasPosition.y -= view.offset.y;

          // if (x % 10 === 0 && y % 10 === 0) console.log(position, world.regions[x][y][z], view, view.center);
          if (
              inViewport(canvasPosition.x, canvasPosition.y - canvasPosition.z) 
              && isBlockVisible(x, y, z, world.x, world.y, world.z, world.regions)
            )
            drawBlock(canvasPosition.x, canvasPosition.y - canvasPosition.z, z, block, .99);
        // }
      }
    }
  }
  // if (!worldLoaded) worldLoaded = true;
}
