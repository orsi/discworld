var EnergyField = require('./EnergyField');
var MassField = require('./MassField');
var WaterField = require('./WaterField');

module.exports = FieldFactory = {
  create: function(field, opts) {
    switch (field) {
      case "energy":
        return new EnergyField(opts);
        break;
      case "mass":
        return new MassField(opts);
        break;
      case "water":
        return new WaterField(opts);
        break;
    }
  }
}
