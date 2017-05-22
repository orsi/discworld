
module.exports = {

};

function Location () {
    this.x;
    this.y;
    this.z;
    this.r;
    this.g;
    this.b;
    this.a;
}
Location.prototype.render = function (ctx, size) {
    // draw left face
    ctx.fillStyle = `rgba(${this.r - 75 + (this.z * 5)}, ${this.g - 75 + (this.z * 5)}, ${this.b - 75 + (this.z * 5)}, ${this.a})`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + size / 2);
    ctx.lineTo(this.x - size / 2, this.y + (size / 2) - (size / 4));
    ctx.lineTo(this.x - size / 2, this.y - size / 4);
    ctx.closePath();
    ctx.fill();

    // draw right face
    ctx.fillStyle = `rgba(${this.r - 45 + (this.z * 5)}, ${this.g - 45 + (this.z * 5)}, ${this.b - 45 + (this.z * 5)}, ${this.a})`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + size / 2);
    ctx.lineTo(this.x + size / 2, this.y + (size / 2) - (size / 4));
    ctx.lineTo(this.x + size / 2, this.y - size / 4);
    ctx.closePath();
    ctx.fill();

    // draw top
    ctx.fillStyle = `rgba(${this.r + (this.z * 5)}, ${this.g + (this.z * 5)}, ${this.b + (this.z * 5)}, ${this.a})`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + size / 2, this.y - size / 4);
    ctx.lineTo(this.x, this.y - size / 2);
    ctx.lineTo(this.x - size / 2, this.y - size / 4);
    ctx.closePath();
    ctx.fill();
}