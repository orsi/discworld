const Component = require('../../shared/Component');

Component.register('health', {
  max: 100,
  limit: 100,
  current: 100
});
Component.register('move', function (from, to) {

});
Component.register('position', {
  x: 0,
  y: 0,
  z: 0,
  zoom: 1
});
Component.register('transform', {
  width: 15,
  height: 45
});
Component.register('render', function (ctx) {
  ctx.fillStyle = 'blue';
  ctx.fillRect(
    (this.components['position'].x - this.components['position'].y) * this.components['position'].zoom / 2, 
    ((this.components['position'].x + this.components['position'].y) * (this.components['position'].zoom / 4)) - (this.components['position'].z * this.components['position'].zoom / 2) - (this.components['position'].zoom / 4), 
    this.components['transform'].width, 
    this.components['transform'].height
  );
});
Component.register('script', {});
Component.register('talk', {});
