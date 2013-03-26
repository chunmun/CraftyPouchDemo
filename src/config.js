Game.config = (function() {

  var config = {
    map: {
      width: 24,
      height: 16,
    },

    tile: {
      width: 16,
      height: 16,
    },

  };

  config.canvasWidth = (function() { return config.map.width * config.tile.width; })();
  config.canvasHeight = (function() { return config.map.height * config.tile.height; })();

  return config;
})();