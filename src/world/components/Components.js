var RenderComponent = require('./RenderComponent');
var InteractComponent = require('./InteractComponent');
var MoveComponent = require('./MoveComponent');
var BoundsComponent = require('./BoundsComponent');
var PositionComponent = require('./PositionComponent');
var HealthComponent = require('./HealthComponent');
var TalkComponent = require('./TalkComponent');
var ScriptComponent = require('./ScriptComponent');

module.exports = Components  = {
  add: function (componentName) {
    var component;
    switch (componentName) {
      case 'position':
        component = new PositionComponent();
        break;
    }
    return component;
  },
  Render: RenderComponent,
  Interact: InteractComponent,
  Move: MoveComponent,
  Bounds: BoundsComponent,
  Position: PositionComponent,
  Health: HealthComponent,
  Talk: TalkComponent,
  Script: ScriptComponent
}
