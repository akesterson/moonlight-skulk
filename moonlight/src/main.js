
var pathfinder = null;
var pathfinder_grid = null;

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'uiGameDisplay');

game.state.add('boot', Boot, false);
game.state.add('preloader', Preloader, false);
game.state.add('game', GameState, false);
game.state.add('startscreen', StartScreen, false);
game.state.add('endscreen', EndScreen, false);

game.state.start('boot');

