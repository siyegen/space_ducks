(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
console.log("Ducks in Space, there are ducks in Spaaace");
var debug = false;

console.logger = function(print, func) {
  if (print) {
    func();
  } else {
    return
  }
};

var Duck = require('./duck.js');

function Game() {

  var self = this;

  var buttonState = { // left right arrow and space only
    LEFT: false,
    RIGHT: false,
    SPACE: false
  };

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
  };

  var registerListeners = function() {
    window.addEventListener('keydown', function(e) {
      var button = Buttons[e.keyCode];
      if (button !== undefined) {
        // if already true, repeated keypress
        if (buttonState[button]) {
          console.logger(debug, function() {
            console.log("key repeat", button);
          });
          buttonState.repeat = true;
        } else {
          buttonState[button] = true;
          buttonState.repeat = false;
          buttonState.heldLength = Date.now();
        }
        console.logger(debug, function() {
          console.log("down", buttonState);
        });
      }
    }, false);

    window.addEventListener('keyup', function(e) {
      var button = Buttons[e.keyCode];
      if (button !== undefined) {
        buttonState[button] = false;
        console.logger(debug, function() {
          console.log("up", buttonState);
        });
        buttonState.repeat = false;
        buttonState.heldLength = 0;
      }
    }, false);
  };

  var init = function() {
    this.requestAnimFrame = window.requestAnimFrame;

    this.stage = new PIXI.Stage(0x733572);

    // create a renderer instance.
    this.renderer = PIXI.autoDetectRenderer(800, 400);
    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);
    registerListeners();
    this.duck = new Duck({x: 200, y: 350}, "images/duck2.png");

    stage.addChild(this.duck);
  };

  var handleInput = function() {
    if (buttonState.LEFT) {
      this.duck.moving = -1;
    } else if (buttonState.RIGHT) {
      this.duck.moving = 1;
    } else {
      this.duck.moving = 0;
    }
  };

  var update = function(timeDelta) {
    this.duck.update(timeDelta);
  };

  var render = function() {
    renderer.render(stage);
  };

  var main = function() {
    handleInput();
    var now = Date.now();
    update((now-self.then)/1000); // ts
    render();
    self.then = now;
    this.requestAnimFrame(main);
  };

  // Public methods
  return {
    start: function() {
      init();
      debugger;
      self.then = Date.now();
      main();
    }
  }
};

var game = new Game();
game.start();
},{"./duck.js":1}]},{},[2])