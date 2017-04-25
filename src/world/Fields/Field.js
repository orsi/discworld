module.exports = Field = class {
  constructor (width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.field = [];
  }
  get(x, y, z) {
      return this.field[x][y][z];
  }
}
