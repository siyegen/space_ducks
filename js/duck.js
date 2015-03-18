module.exports = Duck;

function Duck(startPos, duckImg) {
    var texture = PIXI.Texture.fromImage(duckImg);
    PIXI.Sprite.call(this, texture);
    this.position.x = startPos.x;
    this.position.y = startPos.y;// check ground height
    // center the sprites anchor point
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.acceleration = 100;
    this.currentSpeed = 0;
    this.maxSpeed = 25;
    // var sprite = duckImg;
    // var jumpSprite = duckJumpImg;
};

Duck.prototype.constructor = Duck;
Duck.prototype = Object.create(PIXI.Sprite.prototype);

Duck.prototype.update = function(timeDelta) {
  var dir = 0;
  if (this.moving == -1) {
    dir = 1;
  }
  if (this.moving == 1) {
    dir = -1;
  }
  //this.rotation += 0.1;

  debugger;
  if (dir != 0) {
    this.position.x = (0.5*(this.acceleration*dir)*(timeDelta*timeDelta)+(this.currentSpeed*timeDelta)+this.position.x);
    // y = (0.5*(ACCELERATION*yDir)*(mod*mod)+(currentSpeed*mod)+y);

    this.currentSpeed = this.acceleration*timeDelta+this.currentSpeed;
    // if (currentSpeed > maxSpeed) { // clamp speed, no more acc
    //   currentSpeed = maxSpeed;
    // }
  }
}

