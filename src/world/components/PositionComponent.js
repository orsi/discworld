module.exports = PositionComponent;
function PositionComponent (x, y, z) {
  this.name = 'Position';

  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};
