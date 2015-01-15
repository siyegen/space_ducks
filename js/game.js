console.log("Some ducks here");

function lerp(v0, v1, t) {
  return (1-t)*v0 + t*v1;
}

function normalAcc(v0, v1) {
  return lerp(v0, v1, .5);
}

function normalDec(v0, v1) {
  return lerp(v1, v0, .001);
}

var duck = {
  speed: 200,
  curSpeed: 0,
  x: 60,
  y: 10,
  threshold: 5,
  width: 28,
  height: 28,
  moving: 0 // -1 to 1
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

var gameState = {};
gameState.buttonState = { // left right arrow and space only
  LEFT: false,
  RIGHT: false,
  SPACE: false
};
gameState.duck = duck;

var Buttons = {
  '37': 'LEFT',
  '39': 'RIGHT',
  '32': 'SPACE'
}


window.addEventListener('keydown', function(e) {
  var button = Buttons[e.keyCode];
  if (button !== undefined) {
    console.log("down", gameState.buttonState);
    // if already true, repeated keypress
    if (gameState.buttonState[button]) {
      console.log("key repeat", button);
      gameState.buttonState.repeat = true;
    } else {
      gameState.buttonState[button] = true;
      gameState.buttonState.repeat = false;
      gameState.buttonState.heldLength = Date.now();
    }
  }
}, false);

window.addEventListener('keyup', function(e) {
  var button = Buttons[e.keyCode];
  if (button !== undefined) {
    gameState.buttonState[button] = false;
    console.log("up", gameState.buttonState);
    gameState.buttonState.repeat = false;
    gameState.buttonState.heldLength = 0;
  }
}, false);

//Buttons are not getting released as expected, need to fix
function handleInput() {
  if (gameState.buttonState.LEFT) {
    // debugger
    var howLong = Date.now() - gameState.buttonState.heldLength;
    if (howLong >=0 && howLong < 80) {
      console.log("Should we just turn?", howLong);
      gameState.duck.moving = 0;
    } else {
      gameState.duck.moving = -1;
    }
    gameState.duck.facing = -1;
    // gameState.buttonState.LEFT = false;
  } else if (gameState.buttonState.RIGHT) {
    gameState.duck.moving = 1;
    gameState.duck.facing = 1;
    // gameState.buttonState.RIGHT = false;
  } else {
    gameState.duck.moving = 0;
    // gameState.buttonState.RIGHT = false;
    // gameState.buttonState.LEFT = false;
  }
    // gameState.buttonState.RIGHT = false;
    // gameState.buttonState.LEFT = false;
}

// add vectors for movement
function update(modifier) {
  // if not moving we should slow down
  // console.log("old, new", gameState.lastDuck.x, gameState.duck.x);
  // console.log("speed", gameState.duck.curSpeed);
  // console.log("moving", gameState.duck.moving);
  if (gameState.duck.moving == 0) {
    // console.log("slowing down", gameState.lastDuck.moving);
    // debugger
    if (gameState.duck.curSpeed > (gameState.duck.threshold)) {
      gameState.duck.curSpeed = normalDec(gameState.duck.curSpeed, gameState.duck.speed);
      gameState.duck.x += gameState.duck.curSpeed * gameState.duck.moving * modifier;
    }
    gameState.duck.sprite = duckImage;
  } else { // accelerate duck up
    gameState.duck.curSpeed = normalAcc(gameState.duck.curSpeed, gameState.duck.speed);
    gameState.duck.x += gameState.duck.curSpeed * gameState.duck.moving * modifier;
    gameState.duck.sprite = duckImage;
  }
  gameState.lastDuck = gameState.duck.copy();
}

function render() {
  // console.log("render");
  // draw "bg"
  gameState.ctx.clearRect(0,0,778,400);

  // draw duck!
  gameState.ctx.beginPath();
  gameState.ctx.rect(gameState.duck.x, gameState.duck.y, gameState.duck.width, gameState.duck.height);
  gameState.ctx.stroke();
  gameState.ctx.save();
  gameState.ctx.scale(gameState.duck.facing, 1);
  gameState.ctx.drawImage(
    gameState.duck.sprite,
    gameState.duck.x * gameState.duck.facing - (gameState.duck.facing == 1 ? 0 : gameState.duck.width),
    gameState.duck.y,
    gameState.duck.width,
    gameState.duck.height
  );
  gameState.ctx.restore();
}

function main() {
  handleInput();
  var now = Date.now();
  var delta = now - then;
  update(delta/1000);
  render();
  then = now;
  requestAnimationFrame(main);
}

function init() {
  // create canvas, add to game object
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 778;
  canvas.height = 400;
  gameState.ctx = ctx;
  document.body.appendChild(canvas);
  gameState.duck.moving = 1;
  gameState.duck.facing = 1;
  gameState.lastDuck = gameState.duck.copy();
  gameState.buttonState.heldLength = 0;
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

init();
var then = Date.now();
main();