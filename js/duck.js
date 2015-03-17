module.exports = Duck;

function Duck(startPos, duckImg, duckJumpImg) {
    var x = startPos.x;
    var y = startPos.y;// check ground height
    var sprite = duckImg;
    var jumpSprite = duckJumpImg;
    var speed = 175;
    var curSpeed = 0;
    var jumpSpeed = 1200;
    var curJump = 0;
    var threshold = 5;
    var width = 28;
    var height = 28;
    var moving = 0; // -1 to 1
    var facing = 1;
    var directionChange = 0;
    var jump = false;
    var finishedJump = true;

    return {
        update: function() {
          if (moving == 0) {
            if (curSpeed > (threshold)) {
              curSpeed = normalDec(curSpeed);
              x += curSpeed * facing * timeDelta;
            }
            sprite = duckImage;
          } else { // accelerate duck up
            // Not sure if I like this
            if (jump) {
              curSpeed = normalAcc(curSpeed, speed-50);
            } else {
              curSpeed = normalAcc(curSpeed, speed);
            }
            x += curSpeed * facing * timeDelta;
            sprite = duckImage;
            //gameState.bg.x -= gameState.bg.speed * facing;
          }

          if (jump) {
            sprite = duckFrontImage;
            if (stillJump) {
              curJump = jumpSpeed;
              // stillJump = false;
            }
            if (curJump > threshold) {
              console.log("jump!", curJump);
              y -= curJump * timeDelta;
              curJump = lerp(0, curJump, jumpDecay);
            }
            // "accelerate" duck up Y axis
          } else {
            sprite = duckImage;
          }

          // off ground, add gravity
          if (y < level.ground) {
            console.log('off ground');
            gravity = lerp(gravity, gravityAffect, .4);
            y += gravity * timeDelta;
          } else if (jump) {
            jump = false;
            finishedJump = true;
            gravity = 200;
          }

          // TODO: Update to move with camera, not level (maybe?)
          if (gameState.bg.x < -level.width ||
              gameState.bg.x > level.width) {
            gameState.bg.x = 0;
          }

          if (x <=0) {
            x = 0;
            moving = 0;
          }

          // TODO: Should update to bound inside camera
          if (x + 28 >= level.width) {
            x = level.width - 28;
            moving = 0;
          }
          //gameState.lastDuck = copy();

        },
        render: function() {
          ctx.save(); // to deal with using scale
          ctx.scale(facing, 1);
          ctx.drawImage(
            sprite,
            x * facing - (facing == 1 ? 0 : width), // "move" sprite over by width if reversing
            y - camera.y,
            width,
            height
          );
          ctx.restore();
        },
        copy: function() {
          var other = {};
          for(item in this) {
            other[item] = this[item];
          }
          return other;
        }
    };
};