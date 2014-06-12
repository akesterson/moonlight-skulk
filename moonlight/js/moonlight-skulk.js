
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
// Light constructor
var Light = function(game, x, y, radius, fade, color, flicker) {
    color = ( typeof color == undefined ? [255, 255, 255] : color );
    fade = ( typeof fade == undefined ? 0.25 : fade );
    radius = ( typeof radius == undefined ? 64 : radius );
    flicker = ( typeof flicker == undefined ? false : flicker );
    Phaser.Sprite.call(this, game, x, y, null);

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);
    this.color = color;
    this.radius = radius;
    this.fade = radius * fade
    this.rect = new Phaser.Rectangle(this.x, this.y, radius * 2, radius * 2)
    this.flicker = flicker;

};

// Lightes are a type of Phaser.Sprite
Light.prototype = Object.create(Phaser.Sprite.prototype);
Light.prototype.constructor = Light;

SPRITE_TOWNSFOLK_MALE1 = 1;
SPRITE_TOWNSFOLK_MALE2 = 2;
SPRITE_TOWNSFOLK_MALE3 = 3;
SPRITE_TOWNSFOLK_MALE4 = 4;
SPRITE_TOWNSFOLK_FEMALE1 = 5;
SPRITE_TOWNSFOLK_FEMALE2 = 6;
SPRITE_TOWNSFOLK_FEMALE3 = 7;
SPRITE_TOWNSFOLK_FEMALE4 = 8;
SPRITE_TOWNSFOLK_GUARD1 = 9;
SPRITE_TOWNSFOLK_GUARD2 = 10;

var WanderingSprite = function(game, x, y, spritetype) {
    var spritenames_by_type = [
	'townsfolk-male-1',
	'townsfolk-male-2',
	'townsfolk-male-3',
	'townsfolk-male-4',
	'townsfolk-female-1',
	'townsfolk-female-2',
	'townsfolk-female-3',
	'townsfolk-female-4',
	'townsfolk-guard-1',
	'townsfolk-guard-2'
    ];
    Phaser.Sprite.call(this, game, x, y, spritenames_by_type[spritetype]); 
}

WanderingSprite.prototype = Object.create(Phaser.Sprite.prototype);
WanderingSprite.prototype.constructor = WanderingSprite;

var GameState = function(game) {
}

GameState.prototype.addAnimation = function(obj, anim)
{
    a = moonlightSettings['animations'][anim]
    obj.animations.add(anim, a['frames'], a['speed'], a['loop'])
}

GameState.prototype.preload = function()
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

GameState.prototype.create = function()
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

    this.addAnimation(player, 'bipedwalkleft');
    this.addAnimation(player, 'bipedwalkright');
    this.addAnimation(player, 'bipedwalkup');
    this.addAnimation(player, 'bipedwalkdown');
    this.addAnimation(player, 'bipedrunleft');
    this.addAnimation(player, 'bipedrunright');
    this.addAnimation(player, 'bipedrunup');
    this.addAnimation(player, 'bipedrundown');

    this.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    controls = game.input.keyboard.createCursorKeys();

    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        20, 20, '', { font: '16px Arial', fill: '#ffffff' }
    );
    this.fpsText.fixedToCamera = true;

    this.shadowTexture = game.add.bitmapData(game.world.width, game.world.height);
    this.shadowTextureColor = 'rgb(50, 50, 50)';

    // Create an object that will use the bitmap as a texture
    this.shadowSprite = game.add.image(0, 0, this.shadowTexture);

    // Set the blend mode to MULTIPLY. This will darken the colors of
    // everything below this sprite.
    this.shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;

    // Create the wandering sprites
    this.wanderingSprites = game.add.group();
    for ( i = 0; i < 20 ; i++ ) {
	this.wanderingSprites.add(
	    new WanderingSprite(game,
				game.rnd.integerInRange(0, game.width),
				game.rnd.integerInRange(0, game.height),
				game.rnd.integerInRange(0, 10)
			       )
	);
    }

    // Create the lights
    this.staticLights = game.add.group();
    for (i = 0; i < 20 ; i++ ) {
	this.staticLights.add(
	    new Light(game,
		      game.rnd.integerInRange(0, game.width),
		      game.rnd.integerInRange(0, game.height),
		      game.rnd.integerInRange(0, 128),
		      game.rnd.realInRange(0.0, 1.0),
		      [
			  game.rnd.integerInRange(0, 255),
			  game.rnd.integerInRange(0, 255),
			  game.rnd.integerInRange(0, 255)
		      ],
		      flicker = [true, false][game.rnd.integerInRange(0, 1)]
		 )
	);
    }
    //this.movingLight = new Light(game, game.width/2, game.height/2);
    //this.lights.add(this.movingLight);
}

GameState.prototype.updateShadowTexture = function() {
    // This function updates the shadow texture (this.shadowTexture).
    // First, it fills the entire texture with a dark shadow color.
    // Then it draws a white circle centered on the pointer position.
    // Because the texture is drawn to the screen using the MULTIPLY
    // blend mode, the dark areas of the texture make all of the colors
    // underneath it darker, while the white area is unaffected.

    // Draw shadow
    this.shadowTexture.context.fillStyle = this.shadowTextureColor;
    this.shadowTexture.context.fillRect(0, 0, game.world.width, game.world.height);

    // Iterate through each of the lights and draw the glow
    this.staticLights.forEach(function(light) {
	// Don't draw lights that aren't on screen
	var r1 = new Phaser.Rectangle(this.game.camera.x, 
				      this.game.camera.y, 
				      this.game.camera.width, 
				      this.game.camera.height);
	if ( ! light.rect.intersects(r1) ) {
	    return;
	}

	if ( light.flicker ) {
            // Randomly change the radius each frame
            var radius = light.radius + game.rnd.integerInRange(1,10);
	} else {
	    var radius = light.radius;
	}

        // Draw circle of light with a soft edge
        var gradient =
            this.shadowTexture.context.createRadialGradient(
                light.x + 16, light.y + 16, light.fade,
                light.x + 16, light.y + 16, radius);
        gradient.addColorStop(0, 'rgba(' + light.color[0] + ',' + light.color[1] + ',' + light.color[2] +', 1.0)');
        gradient.addColorStop(1, 'rgba(' + light.color[0] + ',' + light.color[1] + ',' + light.color[2] +', 0.0)');

        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = gradient;
        this.shadowTexture.context.arc(light.x + 16, light.y + 16, radius, 0, Math.PI*2);
        this.shadowTexture.context.fill();
    }, this);

    // This just tells the engine it should update the texture cache
    this.shadowTexture.dirty = true;
};

GameState.prototype.setSpriteMovement = function(spr, running, dir)
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

GameState.prototype.check_input = function()
{

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    velocityMod = 0;

    runningSpeed = {true: 150, false: 75}

    if ( controls.up.isDown) {
	this.setSpriteMovement(player, controls.up.shiftKey, 'up');
    } else if ( controls.down.isDown ) {
	this.setSpriteMovement(player, controls.up.shiftKey, 'down');
    } else if ( controls.left.isDown ) {
	this.setSpriteMovement(player, controls.up.shiftKey, 'left');
    } else if ( controls.right.isDown ) {
	this.setSpriteMovement(player, controls.up.shiftKey, 'right');
    } else {
	player.animations.stop(null, true);
    }
}

GameState.prototype.update = function()
{
    if (game.time.fps !== 0) {
        this.fpsText.setText(game.time.fps + ' FPS');
    }

    this.check_input();
    this.physics.arcade.collide(player, layer);
    //this.movingLight.x = player.x;
    //this.movingLight.y = player.y;
    this.updateShadowTexture();
}

var game = new Phaser.Game(640, 480, Phaser.AUTO, '');
game.state.add('game', GameState, true);
