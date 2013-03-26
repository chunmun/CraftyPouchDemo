var Game = (function (Game) {
  var Game = {
    // config: {
    //   map: {
    //     width: 48,
    //     height: 32,
    //   },

    //   tile: {
    //     width: 16,
    //     height: 16,
    //   },

    //   canvasWidth : this.map.width * this.tile.width,
    //   canvasHeight : this.map.height * this.tile.height,
    // },

    start: function() {
      Crafty.init(Game.config.canvasWidth, Game.config.canvasHeight);
      // Couchdb database must be already created before connection
      Crafty.storage.external('http://localhost:2020/gamedb');
      Crafty.storage.open('Game');
      Crafty.background('rgb(255,255,255)');
      Crafty.scene('Loading');
    },
  };

  return Game;

})(Game || {});
