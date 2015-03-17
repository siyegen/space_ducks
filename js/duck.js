module.exports = Duck;

function Duck(startPos, duckImg) {
    var texture = PIXI.Texture.fromImage(duckImg);
    PIXI.Sprite.call(this, texture);
    this.position.x = startPos.x;
    this.position.y = startPos.y;// check ground height
    // center the sprites anchor point
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    // var sprite = duckImg;
    // var jumpSprite = duckJumpImg;
};

Duck.prototype.constructor = Duck;
Duck.prototype = Object.create(PIXI.Sprite.prototype);

Duck.prototype.update = function(timeDelta) {
  if (this.moving == -1) {
    this.position.x -= 1;
  }
  if (this.moving == 1) {
    this.position.x += 1;
  }
  this.rotation += 0.1;
}

