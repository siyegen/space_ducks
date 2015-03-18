module.exports = Duck;

function Duck(startPos, duckImg) {
    var texture = PIXI.Texture.fromImage(duckImg);
    PIXI.Sprite.call(this, texture);
    this.position.x = startPos.x;
    this.position.y = startPos.y;// check ground height
    // center the sprites anchor point
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.acceleration = 1550;
    this.friction = 6;
    this.currentSpeed = 0;
    this.maxSpeed = 400;
    // var sprite = duckImg;
    // var jumpSprite = duckJumpImg;
};

Duck.prototype.constructor = Duck;
Duck.prototype = Object.create(PIXI.Sprite.prototype);

Duck.prototype.update = function(timeDelta) {
  //this.rotation += 0.1;
  // if (Math.abs(this.currentSpeed) > this.maxSpeed) { // clamp speed, no more acc
  //   console.debug("old", this.currentSpeed);
  //   this.currentSpeed = Math.sign(this.currentSpeed) * this.maxSpeed;
  //   console.debug("new", this.currentSpeed);
  // }
  // multiply by this.moving, gives us proper sign
  var ddX = this.acceleration * this.moving;
  ddX -= this.friction * this.currentSpeed; 
  // if (ddX > -1 && ddX < 1) { // deadzone
  //   this.currentSpeed = 0;
  //   ddX = 0;
  // }
  // console.info(ddX, this.currentSpeed);

  debugger;
  this.position.x = (0.5*ddX*(timeDelta*timeDelta))
    + (this.currentSpeed*timeDelta) + this.position.x;
  // y = (0.5*(ACCELERATION*yDir)*(mod*mod)+(currentSpeed*mod)+y);

  this.currentSpeed = ddX * timeDelta + this.currentSpeed;
}

