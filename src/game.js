var Game = (function (Game) {
  var Game = {
    start : function() {
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
