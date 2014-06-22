
var pathfinder = null;
var pathfinder_grid = null;

var game = new Phaser.Game(640, 480, Phaser.AUTO, '');

game.state.add('boot', Boot, false);
game.state.add('preloader', Preloader, false);
game.state.add('game', GameState, false);

game.state.start('boot');





