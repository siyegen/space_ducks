console.log("Some ducks here");

var duck = {
  speed: 100,
  x: 60,
  y: 10,
  width: 28,
  height: 28,
  direction : {x:0}
}
var duckImage = new Image();
duckImage.src = "images/duck.png";

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
    gameState.buttonState[button] = true;
    console.log(gameState.buttonState);
  }
}, false);

window.addEventListener('keyup', function(e) {
  var button = Buttons[e.keyCode];
  if (button !== undefined) {
    gameState.buttonState[button] = false;
    console.log(gameState.buttonState);
  }
}, false);

function handleInput() {
  // console.log("input");
  if (gameState.buttonState.LEFT) {
    gameState.duck.direction.x = -1;
    gameState.duck.drawX = -1;
  } else if (gameState.buttonState.RIGHT) {
    gameState.duck.direction.x = 1;
    gameState.duck.drawX = 1;
  } else {
    gameState.duck.direction.x = 0;
  }
  // delete gameState.buttonState.LEFT;
  // delete gameState.buttonState.RIGHT;
}

function update(modifier) {
  // console.log("update");
  // move duck!
  gameState.duck.x += gameState.duck.speed * gameState.duck.direction.x * modifier;
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
  debugger
  gameState.ctx.scale(gameState.duck.drawX, 1);
  console.log(gameState.duck.x * gameState.duck.drawX,
    gameState.duck.y,
    gameState.duck.width,
    gameState.duck.height);
  gameState.ctx.drawImage(
    duckImage,
    gameState.duck.x * gameState.duck.drawX - (gameState.duck.drawX == 1 ? 0 : gameState.duck.width),
    gameState.duck.y,
    gameState.duck.width,
    gameState.duck.height
  );
  gameState.ctx.restore();
}

function main() {
  var now = Date.now();
  var delta = now - then;
  handleInput();
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
  gameState.duck.direction.x = 1;
  gameState.duck.drawX = 1;
}

// setInterval(main, 1);
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

init();
var then = Date.now();
main();