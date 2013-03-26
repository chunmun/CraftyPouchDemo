Crafty.c('MenuButton', {
  init: function() {
    this.requires('2D, Canvas, Text, Tween')
      .attr({
        x:20,
        y:20,
        w:80,
        h:20,
        alpha:0,
      })
      .text('MENU')
      .textColor('#FFFFFF')
      .textFont({'size' : '24px', 'family': 'Arial'})
      .bind('toggleMenu', function(menuOn) {
        this.menuOn = menuOn;
        var newAlpha = 0;
        if(menuOn) {
          newAlpha = 1;
        }
        console.log(newAlpha);
        this.tween({alpha: newAlpha},5);
      });
  },
});

Crafty.c('Menu', {
  init: function() {
    this.requires('2D, Canvas, Color, Tween')
      .attr({
        x: 0,
        y: 0,
        h: Game.config.canvasHeight,
        w: Game.config.canvasWidth/4,
        alpha: 0,
      })
      .color('rgb(0,0,0)')
      .bind('toggleMenu', function(menuOn) {
        var newAlpha = 0;
        if(menuOn) {
          newAlpha = 0.8;
        }
        this.menuOn = menuOn;
        this.tween({
          alpha: newAlpha,
        }, 10);
      });

      console.log('Created Menu');
  },

  setOptions: function(arr){

  }

});

// The Grid component allows an element to be located
// on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.config.tile.width,
      h: Game.config.tile.height
    });
  },

  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return {
        x: this.x / Game.config.tile.width,
        y: this.y / Game.config.tile.height
      };
    } else {
      this.attr({
        x: x * Game.config.tile.width,
        y: y * Game.config.tile.height
      });
      return this;
    }
  }
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    console.log('Inside Player init');
    this.requires('Actor, Fourway, Collision, sprPlayer, SpriteAnimation')
      .fourway(2)
      .onHit('Village', this.visitVillage)
      .animate('PlayerMovingUp', 0,0,2)
      .animate('PlayerMovingRight', 0,1,2)
      .animate('PlayerMovingDown', 0,2,2)
      .animate('PlayerMovingLeft', 0,3,2);

      /*
       * These next lines define our four animations
       * each call to .animate specifies:
       * - the name of the animation
       * - the x and y coordinates within the sprite
       *   map at which the animation set begins
       * - the number of animation frames 'in addition' to the first one
       */

    // Bind Save and load events
    this.bind('SaveData', function(data) {
      // Need to overwrite all the components with this super component
      data.c = ["PlayerCharacter"];
      data.x = this.x;
      data.y = this.y;
    }).bind('LoadData', function(data) {
      this.x = data.x;
      this.y = data.y;
    }).bind('freezePlayer', function(onMenu) {
      if(onMenu) {
        this.fourway(0);
      } else {
        this.fourway(2);
      }
    });

    console.log('In da dumps');


    // Watch for a change in direction and switch animation accordingly
    var animationSpeed = 0;
    this.bind('NewDirection', function(data) {
      if (data.x > 0) {
        this.animate('PlayerMovingRight', animationSpeed, -1);
      } else if (data.x < 0) {
        this.animate('PlayerMovingLeft', animationSpeed, -1);
      } else if (data.y < 0) {
        this.animate('PlayerMovingUp', animationSpeed, -1);
      } else if (data.y > 0) {
        this.animate('PlayerMovingDown', animationSpeed, -1);
      } else {
        this.stop();
      }
    })
    // Stops when player hits a solid
    .bind('Moved', function(from) {
      if(this.hit('Solid')) {
        this.attr({
          x: from.x,
          y: from.y
        });
      }
    });
  },

  visitVillage: function(data) {
    village = data[0].obj;
    village.collect();
  }

});

// A village is a tile on the grid that the PC must visit in order
// to win the game
Crafty.c('Village', {
  init: function() {
    this.requires('Actor, sprVillage');
  },

  collect: function() {
    this.destroy();
    Crafty.audio.play('knock');
    Crafty.trigger('VillageVisited', this);
  }
});

Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid')
  }
})

Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Solid, sprTree');
  },
});

Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Solid, sprBush');
  }
});