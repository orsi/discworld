let Actor = function (actor) {
  if (!actor) actor = {}; // catches empty argument list

  this.symbol = actor.symbol || '☺';
  this.color = actor.color || '#fff';
  this.x = actor.x || 0;
  this.y = actor.y || 0;

  this.serialize = function () {
    return JSON.stringify(this);
  }
}
module.exports = Actor;
