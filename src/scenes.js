
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
    'assets/16x16_forest_2.gif',
    'assets/hunter.png',
    'assets/door_knock_3x.mp3',
    'assets/door_knock_3x.ogg',
    'assets/door_knock_3x.aac',
    'assets/board_room_applause.mp3',
    'assets/board_room_applause.ogg',
    'assets/board_room_applause.aac',
    'assets/candy_dish_lid.mp3',
    'assets/candy_dish_lid.ogg',
    'assets/candy_dish_lid.aac'];

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
      knock:     ['assets/door_knock_3x.mp3',
                  'assets/door_knock_3x.ogg',
                  'assets/door_knock_3x.aac'],
      applause:  ['assets/board_room_applause.mp3',
                  'assets/board_room_applause.ogg',
                  'assets/board_room_applause.aac'],
      ring:      ['assets/candy_dish_lid.mp3',
                  'assets/candy_dish_lid.ogg',
                  'assets/candy_dish_lid.aac']
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
        x: (Crafty.viewport.width / 3),
        // x: 20,
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






var player;
var gameMap;
var loadMap = function() {
  if (gameMap === undefined) generateMap();

  for (var x = 0; x < Game.config.map.width; x++) {
    for (var y = 0; y < Game.config.map.height; y++) {
      switch (gameMap[x][y]) {
        case 1: // tree
          Crafty.e('Tree').at(x,y);
          break;

        case 2:
          Crafty.e('Bush').at(x,y)
          break;

        case 3:
          Crafty.e('Village').at(x,y);
          break;
      }
    }
  }
}

var generateMap = function() {
  // A 2D array to keep track of all occupied tiles
  gameMap = [];
  for (var x = 0; x < Game.config.map.width; x++) {
    gameMap[x] = [];
    for (var y = 0; y < Game.config.map.height; y++) {
      gameMap[x][y] = 0;
    }
  }

  gameMap[Game.config.map.width/2][Game.config.map.height/2] = 4; // Player Reserved

  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.config.map.width; x++) {
    for (var y = 0; y < Game.config.map.height; y++) {
      var at_edge = x == 0 || x == Game.config.map.width -1 ||
                    y == 0 || y == Game.config.map.height - 1;

      if (at_edge) {
        gameMap[x][y] = 1; // Tree
      } else if (Math.random() < 0.06 && gameMap[x][y] === 0) {
        gameMap[x][y] = 2; // Bush
      }
    }
  }

  var maxVillages = 5;
  for (var x = 1; x < Game.config.map.width - 1; x++) {
    for (var y = 1; y < Game.config.map.height - 1; y++) {
      if (Math.random() < 0.02 && gameMap[x][y] === 0 && maxVillages > 0) {
        gameMap[x][y] = 3; // Villages
        maxVillages--;
      }
    }
  }
}



/**
 * The actual game scene
 */
Crafty.scene('GameMain', function() {
  // TODO: Implement Viewport
  // TODO: Implement TiledMaps
  loadMap();

  // Player Character, placed at center on the grid
  player = Crafty.e('PlayerCharacter')
    .at(Game.config.map.width/2, Game.config.map.height/2);

  this.showVictory = this.bind('VillageVisited', function(e) {
    gameMap[e.at().x][e.at().y] = 0;
    if (Crafty('Village').length == 0) {
      Crafty.scene('Victory');
    }
  });

  var gameMenu = Crafty.e('Menu');
  var isMenuMode = false;
  var menuBtn = Crafty.e('MenuButton');

  this.saveLoad = this.bind('KeyDown', function(e) {
    var _this = this;
    if (e.keyCode == 79) { // 'o'
      // Save the player
      Crafty.storage.save('player','save',player);
      // Save the map
      Crafty.storage.save('map','save',gameMap);

    } else if (e.keyCode == 80) { // 'p'

      // Load the player
      Crafty.storage.load('player','save',function(data) {
        data._globalZ = player.globalZ;
        player.destroy();
        player = data;
      });

      // Load the map
      Crafty.storage.load('map','save',function(data) {
        Crafty('Tree').destroy();
        Crafty('Bush').destroy();
        Crafty('Village').destroy();
        gameMap = data;
        loadMap();
      });

    } else if (e.keyCode == 77) {
      isMenuMode = !isMenuMode;
      Crafty.trigger('toggleMenu', isMenuMode);
      Crafty.trigger('freezePlayer', isMenuMode);
    }
  });

  console.log('Game Scene done');
}, function() {
  this.unbind('KeyDown', this.saveLoad);
  this.unbind('VillageVisited', this.showVictory);
});


Crafty.scene('Victory', function() {
  console.log('Victory Scene');
  var EndingText = Crafty.e("2D, Canvas, Text")
      .attr({w: 500, h: 30, x: ((Crafty.viewport.width) / 3), y: (Crafty.viewport.height / 2), z: 2})
      .text('Victory')
      .textColor('#000')
      .textFont({'size' : '164px', 'family': 'Arial'});

  var RestartText = Crafty.e("2D, Canvas, Text")
      .attr({w: 500, h: 20, x: ((Crafty.viewport.width) / 3) - 70, y: (Crafty.viewport.height / 2) + 40, z: 2})
      .text('Press any key to restart')
      .textColor('#000')
      .textFont({'size' : '32px', 'family': 'Arial'});

  // Give'em a round of applause!
  Crafty.audio.play('applause');

  // After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  var delay = true;
  setTimeout(function() { delay = false; }, 1000);

  this.restart_game = Crafty.bind('KeyDown', function() {
    if (!delay) {
      generateMap();
      Crafty.scene('GameMain');
    }
  });

}, function() {
  this.unbind('KeyDown', this.restart_game);
});

