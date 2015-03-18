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