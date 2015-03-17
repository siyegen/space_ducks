console.log("Ducks in Space, there are ducks in Spaaace");
var debug = true;

console.logger = function(print, func) {
  if (print) {
    func();
  } else {
    return
  }
};

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

    this.stage = new PIXI.Stage(0x66FF99);
 
    // create a renderer instance.
    this.renderer = PIXI.autoDetectRenderer(400, 300);
    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);
    registerListeners();
    var texture = PIXI.Texture.fromImage("images/duck2.png");
    // create a new Sprite using the texture
    this.duck = new PIXI.Sprite(texture);
 
    // center the sprites anchor point
    this.duck.anchor.x = 0.5;
    this.duck.anchor.y = 0.5;
 
    // move the sprite t the center of the screen
    this.duck.position.x = 200;
    this.duck.position.y = 150;
 
    stage.addChild(this.duck);
  };

  var handleInput = function() {
  };

  var update = function(timeDelta) {
    this.duck.rotation += 0.2;
  };

  var render = function() {
    renderer.render(stage);
  };

  var main = function() {
    handleInput();
    var now = Date.now();
    update((now-this.then)/1000); // ts
    render();
    this.then = now;
    this.requestAnimFrame(main);
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

var game = new Game();
game.start();