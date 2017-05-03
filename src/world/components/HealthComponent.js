module.exports = HealthComponent;
function HealthComponent (value) {
  this.name = 'Health';
  this.health = value || 100;
};
