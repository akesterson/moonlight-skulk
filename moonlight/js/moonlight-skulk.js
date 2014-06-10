var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var moonlightSettings = {
    'map' : {
	'tilesets': [
	    { 'name': 'Macks-tilea2',
	      'path': 'gfx/Macks-tilea2.png'
	    },
	    { 'name': 'Macks-tilea3',
	      'path': 'gfx/Macks-tilea3.png'
	    }
	],
	'collisionRange': [385, 512],
	'path': 'gfx/junkmap.json'
    },
    'images': [
    ],
    'spritesheets': [
	{
	    'name': 'player',
	    'path': 'gfx/sprites/sprite-player.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-male-1',
	    'path': 'gfx/sprites/sprite-townsfolk-male-1.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-male-2',
	    'path': 'gfx/sprites/sprite-townsfolk-male-2.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-male-3',
	    'path': 'gfx/sprites/sprite-townsfolk-male-3.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-male-4',
	    'path': 'gfx/sprites/sprite-townsfolk-male-4.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-female-1',
	    'path': 'gfx/sprites/sprite-townsfolk-female-1.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-female-2',
	    'path': 'gfx/sprites/sprite-townsfolk-female-2.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-female-3',
	    'path': 'gfx/sprites/sprite-townsfolk-female-3.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-female-4',
	    'path': 'gfx/sprites/sprite-townsfolk-female-4.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-guard-1',
	    'path': 'gfx/sprites/sprite-townsfolk-guard-1.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	},
	{
	    'name': 'townsfolk-guard-2',
	    'path': 'gfx/sprites/sprite-townsfolk-guard-2.png',
	    'width': 32,
	    'height': 32,
	    'frames': 12
	}
    ],
    'animations': {
	'bipedwalkdown': {
	    'frames': [1, 2, 0],
	    'speed': 4,
	    'loop': true
	},
	'bipedwalkleft': {
	    'frames': [4, 5, 3],
	    'speed': 4,
	    'loop': true
	},
	'bipedwalkright': {
	    'frames': [7, 8, 6],
	    'speed': 4,
	    'loop': true
	},
	'bipedwalkup': {
	    'frames': [10, 11, 9],
	    'speed': 4,
	    'loop': true
	},
	'bipedrundown': {
	    'frames': [1, 2, 0],
	    'speed': 12,
	    'loop': true
	},
	'bipedrunleft': {
	    'frames': [4, 5, 3],
	    'speed': 12,
	    'loop': true
	},
	'bipedrunright': {
	    'frames': [7, 8, 6],
	    'speed': 12,
	    'loop': true
	},
	'bipedrunup': {
	    'frames': [10, 11, 9],
	    'speed': 12,
	    'loop': true
	} 
    }
};

function addAnimation(obj, anim)
{
    a = moonlightSettings['animations'][anim]
    obj.animations.add(anim, a['frames'], a['speed'], a['loop'])
}

function preload()
{    
    for (var k in moonlightSettings['map']['tilesets']) {
	var ts = moonlightSettings['map']['tilesets'][k];
	this.load.image(ts['name'], ts['path']);
    }
    for (var k in moonlightSettings['images']) {
	var i = moonlightSettings['images'][k];
	this.load.image(i['name'], i['path']);
    }
    for (var k in moonlightSettings['spritesheets']) {
	var s = moonlightSettings['spritesheets'][k]
	game.load.spritesheet(s['name'], s['path'], s['width'], s['height'], s['frames'])
    }
    this.load.tilemap('map', 
		      moonlightSettings['map']['path'], 
		      null, 
		      Phaser.Tilemap.TILED_JSON);
}

function create()
{
    map = this.add.tilemap('map');
    for (var k in moonlightSettings['map']['tilesets']) {
	var ts = moonlightSettings['map']['tilesets'][k];
	map.addTilesetImage(ts['name']);
    }
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    map.setCollisionBetween(
	moonlightSettings['map']['collisionRange'][0],
	moonlightSettings['map']['collisionRange'][1]
    );

    player = this.add.sprite(10, 10, 'player');

    addAnimation(player, 'bipedwalkleft');
    addAnimation(player, 'bipedwalkright');
    addAnimation(player, 'bipedwalkup');
    addAnimation(player, 'bipedwalkdown');
    addAnimation(player, 'bipedrunleft');
    addAnimation(player, 'bipedrunright');
    addAnimation(player, 'bipedrunup');
    addAnimation(player, 'bipedrundown');

    this.physics.arcade.enable(player);
    this.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    controls = game.input.keyboard.createCursorKeys();
}

function setSpriteMovement(spr, running, dir)
{
    var x = 0;
    var y = 0;

    if ( running ) {
	x = 200;
	y = 200;
	spr.animations.play("bipedrun" + dir);
    } else {
	x = 75;
	y = 75;
	spr.animations.play("bipedwalk" + dir);
    }

    if ( dir == "left" ) {
	spr.body.velocity.x = -x;
	spr.body.velocity.y = 0;
    } else if ( dir == "right" ) {
	spr.body.velocity.x = x;
	spr.body.velocity.y = 0;
    } else if ( dir == "up" ) {
	spr.body.velocity.x = 0;
	spr.body.velocity.y = -y;
    } else if ( dir == "down" ) {
	spr.body.velocity.x = 0;
	spr.body.velocity.y = y;
    }
}

function check_input()
{
    if ( player.body.x < 0 )
	player.body.x = 0;
    if ( player.body.y < 0 )
	player.body.y = 0;
    if ( (player.body.x + player.body.width) > game.world.width )
	player.body.x = ( game.world.width - player.body.width);
    if ( (player.body.y + player.body.height) > game.world.height )
	player.body.y = ( game.world.height - player.body.height);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    velocityMod = 0;

    runningSpeed = {true: 150, false: 75}

    if ( controls.up.isDown) {
	setSpriteMovement(player, controls.up.shiftKey, 'up');
    } else if ( controls.down.isDown ) {
	setSpriteMovement(player, controls.up.shiftKey, 'down');
    } else if ( controls.left.isDown ) {
	setSpriteMovement(player, controls.up.shiftKey, 'left');
    } else if ( controls.right.isDown ) {
	setSpriteMovement(player, controls.up.shiftKey, 'right');
    } else {
	player.animations.stop(null, true);
    }
}

function update()
{
    check_input();
    this.physics.arcade.collide(player, layer);
}
