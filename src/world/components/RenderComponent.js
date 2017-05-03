module.exports = RenderComponent;
function RenderComponent (color, size) {
  this.name = 'Render';
  this.color = color || {
    r: 255,
    g: 255,
    b: 255
  };
  this.size = size || 5;
}

RenderComponent.prototype.render = function () {}
