var Game = (function (Game) {
  var Game = {
    start : function() {
      Crafty.init(Game.config.canvasWidth, Game.config.canvasHeight);
      Crafty.storage.open('Game');
      Crafty.storage.external('localhost:2020');
      Crafty.background('rgb(255,255,255)');
      Crafty.scene('Loading');
    },
  };

  return Game;

})(Game || {});
