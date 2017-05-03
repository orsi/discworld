module.exports = BoundsComponent;
function BoundsComponent (height, width, depth) {
  this.name = 'Bounds';
  this.height = height || 3;
  this.width = width || 2;
  this.depth = depth || 2;
};
