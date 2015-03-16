console.log("Some ducks here");

console.logger = function(print, func) {
  if (print) {
    func();
  } else {
    return
  }
};

function lerp(v0, v1, t) {
  return (1-t)*v0 + t*v1;
}

function normalAcc(v0, v1) {
  return lerp(v0, v1, .5);
}

function normalDec(v1) {
  return lerp(v1, 0, .3);
}

var camera = {
  x: 0,
  y: 0, // Center of camera
  width: 800,
  height: 450
};

// super naive level
var level = {
  width: 1500,
  height: 400,
  ground: 300 - 28 + 10, // convert to "world" coords
  blockSize: 28,
  data: [] // Format: {startX:0, startY:0, width: 'in blocks', height: 'in blocks'}
};

level.data.push({x: 500, y: 0, width: 2, height: 2});
level.data.push({x: 1000, y: 0, width: 2, height: 2});
level.data.push({x: 1250, y: 0, width: 2, height: 2});

var jumpDecay = 0.7;
var gravity = 200;
var gravityAffect = 450;

var duck = {
  speed: 175,
  curSpeed: 0,
  jumpSpeed: 1200,
  curJump: 0,
  x: level.width/2 - (28/2),
  y: level.ground, // ground - height + spacer
  threshold: 5,
  width: 28,
  height: 28,
  moving: 0, // -1 to 1
  facing: 1,
  directionChange: 0,
  jump: false,
  finishedJump: true
}
duck.copy = function() {
  var other = {};
  for(item in this) {
    other[item] = this[item];
  }
  return other
};

var duckImage = new Image();
duckImage.src = "images/duck2.png";
var duckFrontImage = new Image();
duckFrontImage.src = "images/duck_front.png";
duck.sprite = duckImage;

var bg = {
  speed: 0.5,
  x: 0,
  y: 0,
  width: 778,
  height: 400
};
var bgStars = new Image();
bgStars.src = "images/star-bg.png";

var gameState = {debug: false};
gameState.buttonState = { // left right arrow and space only
  LEFT: false,
  RIGHT: false,
  SPACE: false
};
gameState.duck = duck;
gameState.bg = bg;

var Buttons = {
  '37': 'LEFT',
  '39': 'RIGHT',
  '32': 'SPACE',
  '87': 'W'
};

var gameHistory = {
  'commands': [],
  'start': {},
  'commandCount': 0
}

window.addEventListener('keydown', function(e) {
  var button = Buttons[e.keyCode];
  if (button !== undefined) {
    // if already true, repeated keypress
    if (gameState.buttonState[button]) {
      console.logger(gameState.debug, function() {
        console.log("key repeat", button);
      });
      gameState.buttonState.repeat = true;
    } else {
      gameState.buttonState[button] = true;
      gameState.buttonState.repeat = false;
      gameState.buttonState.heldLength = Date.now();
    }
    console.logger(gameState.debug, function() {
      console.log("down", gameState.buttonState);
    });
  }
}, false);

window.addEventListener('keyup', function(e) {
  var button = Buttons[e.keyCode];
  if (button !== undefined) {
    gameState.buttonState[button] = false;
    console.logger(gameState.debug, function() {
      console.log("up", gameState.buttonState);
    });
    gameState.buttonState.repeat = false;
    gameState.buttonState.heldLength = 0;
  }
}, false);

//Buttons are not getting released as expected, need to fix
function handleInput(now) {
  if (gameState.buttonState.W && (now - gameState.buttonState.heldLength < 15)) {
    console.logger(gameState.debug, function() {
      console.log('pressed w');
    });
    if (gameState.record) {
      console.logger(gameState.debug, function() {
        console.log("starting playback");
      });
      gameState.play = true;
      gameState.record = false;
      gameState.duck = gameHistory.start.copy();
    } else if (gameState.play) {
      console.logger(gameState.debug, function() {
        console.log("stopping playback");
      });
      gameState.play = false;
    } else {
      gameHistory.start = gameState.duck.copy();
      console.logger(gameState.debug, function() {
        console.log('record!');
      });
      gameState.record = true;
    }
  }
  if (gameState.record === true) {
    gameHistory.commands.push(JSON.stringify(gameState.buttonState));
  }
  if (gameState.play === true) {
    gameState.buttonState = JSON.parse(gameHistory.commands[gameHistory.commandCount++]);
    if (gameHistory.commandCount >= gameHistory.commands.length) {
      gameHistory.commandCount = 0;
      gameState.duck = gameHistory.start.copy();
    }
  }

  var howLong = now - gameState.buttonState.heldLength;
  if (gameState.buttonState.LEFT) {
    gameState.duck.facing = -1;
    if (gameState.duck.facing != gameState.lastDuck.facing) {
      gameState.duck.directionChange = now;
    }
    if (gameState.duck.directionChange) {
      if (now - gameState.duck.directionChange > 100){
        gameState.duck.moving = -1;
        gameState.duck.directionChange = undefined;
      } else {
        gameState.duck.moving = 0;
      }
    } else {
      gameState.duck.moving = -1;
    }
  } else if (gameState.buttonState.RIGHT) {
    gameState.duck.facing = 1;
    if (gameState.duck.facing != gameState.lastDuck.facing) {
      gameState.duck.directionChange = now;
    }
    if (gameState.duck.directionChange) {
      if (now - gameState.duck.directionChange > 100){
        gameState.duck.moving = 1;
        gameState.duck.directionChange = undefined;
      } else {
        gameState.duck.moving = 0;
      }
    } else {
      gameState.duck.moving = 1;
    }
  } else {
    gameState.duck.moving = 0;
  }

  var jumpHeld = Date.now() - gameState.buttonState.heldLength;
  if (gameState.buttonState.SPACE) {
    if (gameState.duck.finishedJump) { // only trigger one jump
      console.log("hit jump~!");
      gameState.duck.jump = true;
      gameState.duck.stillJump = true;
      gameState.duck.finishedJump = false;
    }

    if (jumpHeld > 150) {
      gameState.duck.stillJump = false;
    }
  } else if (gameState.lastDuck.stillJump) {
    gameState.duck.stillJump = false;
  }

  // Camera, work on bounds and "follow" feel later
  // if (gameState.duck.x > camera.width - (camera.width/4)) {
    camera.x = duck.x
  // }
}

// add vectors for movement
function update(modifier) {
  if (gameState.duck.moving == 0) {
    if (gameState.duck.curSpeed > (gameState.duck.threshold)) {
      gameState.duck.curSpeed = normalDec(gameState.duck.curSpeed);
      gameState.duck.x += gameState.duck.curSpeed * gameState.duck.facing * modifier;
    }
    gameState.duck.sprite = duckImage;
  } else { // accelerate duck up
    // Not sure if I like this
    if (gameState.duck.jump) {
      gameState.duck.curSpeed = normalAcc(gameState.duck.curSpeed, gameState.duck.speed-50);
    } else {
      gameState.duck.curSpeed = normalAcc(gameState.duck.curSpeed, gameState.duck.speed);
    }
    gameState.duck.x += gameState.duck.curSpeed * gameState.duck.facing * modifier;
    gameState.duck.sprite = duckImage;
    gameState.bg.x -= gameState.bg.speed * gameState.duck.facing;
  }

  if (gameState.duck.jump) {
    gameState.duck.sprite = duckFrontImage;
    if (gameState.duck.stillJump) {
      gameState.duck.curJump = gameState.duck.jumpSpeed;
      // gameState.duck.stillJump = false;
    }
    if (gameState.duck.curJump > gameState.duck.threshold) {
      console.log("jump!", gameState.duck.curJump);
      gameState.duck.y -= gameState.duck.curJump * modifier;
      gameState.duck.curJump = lerp(0, gameState.duck.curJump, jumpDecay);
    }
    // "accelerate" duck up Y axis
  } else {
    gameState.duck.sprite = duckImage;
  }

  // off ground, add gravity
  if (gameState.duck.y < level.ground) {
    console.log('off ground');
    gravity = lerp(gravity, gravityAffect, .4);
    gameState.duck.y += gravity * modifier;
  } else if (gameState.duck.jump) {
    gameState.duck.jump = false;
    gameState.duck.finishedJump = true;
    gravity = 200;
  }

  // TODO: Update to move with camera, not level (maybe?)
  if (gameState.bg.x < -level.width ||
      gameState.bg.x > level.width) {
    gameState.bg.x = 0;
  }

  if (gameState.duck.x <=0) {
    gameState.duck.x = 0;
    gameState.duck.moving = 0;
  }

  // TODO: Should update to bound inside camera
  if (gameState.duck.x + 28 >= level.width) {
    gameState.duck.x = level.width - 28;
    gameState.duck.moving = 0;
  }
  gameState.lastDuck = gameState.duck.copy();
}

function render() {
  // Should only clear viewport
  gameState.ctx.clearRect(0,0,camera.width,camera.height);
  // draw "bg"
  gameState.bgCtx.drawImage(bgStars, gameState.bg.x - bg.width, 0, bg.width, bg.height); // left
  gameState.bgCtx.drawImage(bgStars, gameState.bg.x, 0, bg.width, bg.height); // middle
  gameState.bgCtx.drawImage(bgStars, gameState.bg.x + bg.width, 0, bg.width, bg.height); // right

  // draw the level, ground and all 
  gameState.ctx.fillStyle = "#733572";
  gameState.ctx.fillRect(0,300,level.width,100);
  gameState.ctx.beginPath();
  gameState.ctx.lineWidth = "2";
  gameState.ctx.strokeStyle = "#040110";
  gameState.ctx.moveTo(0, 300);
  gameState.ctx.lineTo(level.width, 300);
  gameState.ctx.stroke();


  // level data
  gameState.ctx.save();
  gameState.ctx.translate(camera.x, camera.y);
  for (var i = 0; i<level.data.length; i++) {
    gameState.ctx.fillStyle = "#11da7e";
    gameState.ctx.fillRect(
      level.data[i].x,
      level.data[i].y,
      level.data[i].width * level.blockSize,
      level.data[i].height * level.blockSize
    );
  }

  // draw duck!
  if (gameState.debug) {
    gameState.ctx.beginPath();
    gameState.ctx.rect(gameState.duck.x - camera.x, gameState.duck.y - camera.y, gameState.duck.width, gameState.duck.height);
    gameState.ctx.stroke();
  }
  gameState.ctx.save();
  gameState.ctx.scale(gameState.duck.facing, 1);
  gameState.ctx.drawImage(
    gameState.duck.sprite,
    gameState.duck.x * gameState.duck.facing - (gameState.duck.facing == 1 ? 0 : gameState.duck.width), // "move" sprite over by width if reversing
    gameState.duck.y - camera.y,
    gameState.duck.width,
    gameState.duck.height
  );
  gameState.ctx.restore();
  gameState.ctx.restore();
  gameState.ctx.setTransform(1,0,0,1,0,0);
}

function main(n) {
  var now = Date.now();
  // console.log("n,now", n, now);
  var delta = now - then;
  handleInput(now);
  update(delta/1000);
  render();
  then = now;
  requestAnimationFrame(main);
}

function createCanvas(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas
}

function init() {
  // create canvas, add to game object
  var bgCanvas = createCanvas(camera.width, camera.height);
  var canvas = createCanvas(camera.width, camera.height);
  gameState.ctx = canvas.getContext('2d');
  gameState.bgCtx = bgCanvas.getContext('2d');
  canvas.style.background = 'transparent';
  document.body.appendChild(bgCanvas);
  document.body.appendChild(canvas);
  gameState.duck.moving = 1;
  gameState.duck.facing = 1;
  gameState.lastDuck = gameState.duck.copy();
  gameState.buttonState.heldLength = 0;
  // draw ground
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

init();
var then = Date.now();
main();