(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Game() {

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
  };

  var init = function() {
    this.requestAnimationFrame = window.requestAnimationFrame;

  };

  var handleInput = function() {
    for (ops in buttonState) {
      if (buttonState[ops]) {
        console.log("button pressed", ops);
      }
    }
    // if (gameState.buttonState.LEFT) {
    //   gameState.duck.facing = -1;
    //   if (gameState.duck.facing != gameState.lastDuck.facing) {
    //     gameState.duck.directionChange = now;
    //   }
    //   if (gameState.duck.directionChange) {
    //     if (now - gameState.duck.directionChange > 100){
    //       gameState.duck.moving = -1;
    //       gameState.duck.directionChange = undefined;
    //     } else {
    //       gameState.duck.moving = 0;
    //     }
    //   } else {
    //     gameState.duck.moving = -1;
    //   }
    // } else if (gameState.buttonState.RIGHT) {
    //   gameState.duck.facing = 1;
    //   if (gameState.duck.facing != gameState.lastDuck.facing) {
    //     gameState.duck.directionChange = now;
    //   }
    //   if (gameState.duck.directionChange) {
    //     if (now - gameState.duck.directionChange > 100){
    //       gameState.duck.moving = 1;
    //       gameState.duck.directionChange = undefined;
    //     } else {
    //       gameState.duck.moving = 0;
    //     }
    //   } else {
    //     gameState.duck.moving = 1;
    //   }
    // } else {
    //   gameState.duck.moving = 0;
    // }

    // var jumpHeld = Date.now() - gameState.buttonState.heldLength;
    // if (gameState.buttonState.SPACE) {
    //   if (gameState.duck.finishedJump) { // only trigger one jump
    //     console.log("hit jump~!");
    //     gameState.duck.jump = true;
    //     gameState.duck.stillJump = true;
    //     gameState.duck.finishedJump = false;
    //   }

    //   if (jumpHeld > 150) {
    //     gameState.duck.stillJump = false;
    //   }
    // } else if (gameState.lastDuck.stillJump) {
    //   gameState.duck.stillJump = false;
    // }

    // // Camera, work on bounds and "follow" feel later
    // // if (gameState.duck.x > camera.width - (camera.width/4)) {
    //   camera.x = duck.x
    // // }
  };

  var update = function(timeDelta) {

  };

  var render = function() {

  };

  var main = function() {
    handleInput();
    var now = Date.now();
    update((now-this.then)/1000); // ts
    render();
    this.then = now;
    this.requestAnimationFrame(main);
  };

  // Public methods
  return {
    start: function() {
      init();
      this.then = Date.now();
      main(Date.now());
    }
  }
};
},{}]},{},[1])