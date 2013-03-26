
/**
 * Loading Scene in the Game
 */
Crafty.scene('Loading', function() {
  var loadingText = Crafty.e("2D, DOM, Text")
      .attr({w: 500, h: 20, x: ((Crafty.viewport.width) / 2), y: (Crafty.viewport.height / 2), z: 2})
      .text('Loading ...')
      .textColor('#000')
      .textFont({'size' : '24px', 'family': 'Arial'});


  var assets = [
    'assets/16x16_forest_1.gif',
    'assets/hunter.png',
    'assets/door_knock_3x.mp3',
    'assets/door_knock_3x.ogg',
    'assets/door_knock_3x.aac'];

  // Load our sprite map image
  Crafty.load(assets, function() {
    // Define the individual sprites in the image
    // Each one (sprTree, etc) becomes a component
    Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
      sprTree: [0,0],
      sprBush: [1,0],
      sprVillage: [0,1]
    });

    Crafty.sprite(16, 'assets/hunter.png', {
      sprPlayer: [0,2]
    }, 0, 2);

    // Define out sounds for later use
    Crafty.audio.add({
      knock: [
        'assets/door_knock_3x.mp3',
        'assets/door_knock_3x.ogg',
        'assets/door_knock_3x.aac']
    });

    console.log('Game Assets Loaded');
    Crafty.scene('StartSplash');
  });

}, function() {

});

/**
 * Start Splash Scene
 */

var blackout = function() {
  Crafty.e('2D, Canvas, Color, Tween')
    .attr({
      x: 0,
      y: 0,
      w: Crafty.viewport.width,
      h: Crafty.viewport.height,
      alpha: 0.0,
    })
    .color('rgb(0,0,0)')
    .tween({alpha:1.0},20)
    .bind('TweenEnd', function() {
      this.destroy();
      Crafty.scene('StartMenu');
    });
}

Crafty.scene('StartSplash', function() {
  var StartText = Crafty.e("2D, Canvas, Text")
      .attr({
        w: 100,
        h: 20,
        // x: (Crafty.viewport.width / 2),
        x: 20,
        y: (Crafty.viewport.height / 2),
        z: 2
      })
      .text('Press any key to start game')
      .textColor('rgb(0,0,0)')
      .textFont({'size' : '24px', 'family': 'Arial'});

  Crafty.bind('KeyDown', blackout);

}, function() {
  Crafty.unbind('KeyDown', blackout);
});

/**
 * Start Menu Scene
 * - Menu to start new game or load saved games
 */
Crafty.scene('StartMenu', function() {

  // TODO: Implement Start menu
  Crafty.scene('GameMain');
}, function() {

});


/**
 * The actual game scene
 */
Crafty.scene('GameMain', function() {
  // TODO: Implement Viewport
  // TODO: Implement TiledMaps

  // A 2D array to keep track of all occupied tiles
  this.occupied = [];
  for (var x = 0; x < Game.config.map.width; x++) {
    this.occupied[x] = [];
    for (var y = 0; y < Game.config.map.height; y++) {
      this.occupied[x][y] = false;
    }
  }

  // Player Character, placed at center on the grid
  this.player = Crafty.e('PlayerCharacter')
    .at(Game.config.map.width/2, Game.config.map.height/2);

  this.occupied[this.player.at().x][this.player.at().y] = true;

  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.config.map.width; x++) {
    for (var y = 0; y < Game.config.map.height; y++) {
      var at_edge = x == 0 || x == Game.config.map.width -1 ||
                    y == 0 || y == Game.config.map.height - 1;

      if (at_edge) {
        Crafty.e('Tree').at(x,y);
        this.occupied[x][y] = true;
      } else if (Math.random() < 0.06 && !this.occupied[x][y]) {
        Crafty.e('Bush').at(x,y)
        this.occupied[x][y] = true;
      }
    }
  }

  var maxVillages = 5;
  for (var x = 1; x < Game.config.map.width - 1; x++) {
    for (var y = 1; y < Game.config.map.height - 1; y++) {
      if (Math.random() < 0.02 && !this.occupied[x][y]) {
        Crafty.e('Village').at(x,y);

        if (Crafty('Village').length >= maxVillages) {
          break;
        }

      }
    }
  }

  // var player2 = Crafty.e("Actor, 2D, Canvas, Grid, Fourway, Collision, sprPlayer, Sprite, SpriteAnimation,Actor, 2D, Canvas, Grid, Fourway, Collision, sprPlayer, Sprite, SpriteAnimation, PlayerCharacter");
  // console.log('Player2');
  // console.log(player2);
  // console.log(this.player);

  var showVictory = this.bind('VillageVisited', function() {
    console.log(Crafty('Village'));
    console.log(Crafty('Village').length);
    if (Crafty('Village').length == 0) {
      Crafty.scene('Victory');
    } else {
      console.log('There are still some left');
    }
  });

  var SaveLoad = this.bind('KeyDown', function(e) {
    var _this = this;
    if (e.keyCode == 79) { // 'o'
      Crafty.storage.save('player','save',this.player);
    } else if (e.keyCode == 80) { // 'p'
     Crafty.storage.load('player','save',function(data) {
        console.log('Loaded save data');
        _this.player.destroy();
        _this.player = data;
      });
    }
  });

  console.log('Game Scene done');
}, function() {
  Crafty.unbind('VillageVisited', showVictory);
});

Crafty.scene('Victory', function() {
  console.log('Victory Scene');
}, function() {

});

