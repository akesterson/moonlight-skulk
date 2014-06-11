
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
	{
	    'name': 'simplelight',
	    'path': 'gfx/lights/light-white-256px.png'
	}
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

// Create torch objects
// Torch constructor
var Torch = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
};

// Torches are a type of Phaser.Sprite
Torch.prototype = Object.create(Phaser.Sprite.prototype);
Torch.prototype.constructor = Torch;

var Gamestate = function(game) {
}

Gamestate.prototype.addAnimation = function(obj, anim)
{
    a = moonlightSettings['animations'][anim]
    obj.animations.add(anim, a['frames'], a['speed'], a['loop'])
}

Gamestate.prototype.preload = function()
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

Gamestate.prototype.create = function()
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
    this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    addAnimation(player, 'bipedwalkleft');
    addAnimation(player, 'bipedwalkright');
    addAnimation(player, 'bipedwalkup');
    addAnimation(player, 'bipedwalkdown');
    addAnimation(player, 'bipedrunleft');
    addAnimation(player, 'bipedrunright');
    addAnimation(player, 'bipedrunup');
    addAnimation(player, 'bipedrundown');

    this.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    controls = game.input.keyboard.createCursorKeys();

    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        20, 20, '', { font: '16px Arial', fill: '#ffffff' }
    );

    this.shadowTexture = game.add.bitmapData(game.width, game.height);

    // Create an object that will use the bitmap as a texture
    this.lightSprite = game.add.image(0, 0, this.shadowTexture);

    // Set the blend mode to MULTIPLY. This will darken the colors of
    // everything below this sprite.
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    // Create the lights
    this.lights = game.add.group();
    this.movingLight = new Torch(game, game.width/2, game.height/2);
    this.lights.add(this.movingLight);

}

Gamestate.prototype.updateShadowTexture = function() {
    // This function updates the shadow texture (this.shadowTexture).
    // First, it fills the entire texture with a dark shadow color.
    // Then it draws a white circle centered on the pointer position.
    // Because the texture is drawn to the screen using the MULTIPLY
    // blend mode, the dark areas of the texture make all of the colors
    // underneath it darker, while the white area is unaffected.

    // Draw shadow
    this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
    this.shadowTexture.context.fillRect(0, 0, game.width, game.height);

    // Iterate through each of the lights and draw the glow
    this.lights.forEach(function(light) {
        // Randomly change the radius each frame
        var radius = 64 + game.rnd.integerInRange(1,10);

        // Draw circle of light with a soft edge
        var gradient =
            this.shadowTexture.context.createRadialGradient(
                light.x, light.y, 64 * 0.25,
                light.x, light.y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = gradient;
        this.shadowTexture.context.arc(light.x, light.y, radius, 0, Math.PI*2);
        this.shadowTexture.context.fill();
    }, this);

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
};

Gamestate.prototype.setSpriteMovement = function(spr, running, dir)
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

Gamestate.prototype.check_input = function()
{

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

Gamestate.prototype.update = function()
{
    if (game.time.fps !== 0) {
        this.fpsText.setText(game.time.fps + ' FPS');
    }

    check_input();
    this.physics.arcade.collide(player, layer);
    this.lightSprite.x = game.camera.x;
    this.lightSprite.y = game.camera.y;
    this.movingLight.x = player.x;
    this.movingLight.y = player.y;
    this.updateShadowTexture();
}

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });
game.state.add('game', GameState, true);
