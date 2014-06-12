STATE_UNAWARE = 1 << 1;
STATE_CONCERNED = 1 << 2;
STATE_ALERTED = 1 << 3;
STATE_LOSTHIM = 1 << 4;
STATE_RUN = 1 << 5;
STATE_MOVE_LEFT = 1 << 6;
STATE_MOVE_RIGHT = 1 << 7;
STATE_MOVE_UP = 1 << 8;
STATE_MOVE_DOWN = 1 << 9;

SPRITE_TOWNSFOLK_MALE = 1;
SPRITE_TOWNSFOLK_FEMALE = 2;
SPRITE_TOWNSFOLK_GUARD = 3;

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

var moonlightDialog = {
    "status": {
	"townsfolk-male" : {
	    "unaware" : [
		"I'd rather be fishing.",
		"Different day, same old stuff.",
		"Oi! Where'd that trouble run off to now then?",
		"The missus is off shoppin', and here I am sittin' on me Jack Jones.",
		"Oy I'm gonna have a butcher’s at that new tailor's knickers he has for sale.",
		"I'm off to the pub to see the lads and chew the fat.",
		"♪ ♫ Whistling ♪ ♫"
	    ],
	    "concerned" : [
		"Wha… what’s that? Who’s there?",
		"Did you hear that?",
		"Either I’m hearin’ things, or I need to stop drinkin’ midday.",
		"Oi? I don’t want no tomfoolery; come out if you’re there!",
		"Must be them darned kids again.",
		"What’s that?",
		"Did you see that?"
	    ],
	    "alerted" : [
		"Don't you come no closer, you hear?",
		"Egads!",
		"I'm getting’ outta here!",
		"What's going on?!",
		"Holy bejeezus!",
		"Did you see that?",
		"What're you doing?!",
		"Get away!",
		"Get away from me!",
		"Stay away! I know Kung-fu! ... but that would require bravery I don't have",
		"Guards! GUARDS!"
	    ],
	    "losthim" : [
		"Whew. Glad that’s over.",
		"I wasn’t scared!",
		"Must’ve been intimidated by manly physique.",
		"That’s right! Run away!",
		"Aye, and don’t-cha come back!",
		"Spoony Bard...",
		"Bloody wanker!" 
	    ]
	},
	"townsfolk-female" : {
	    "unaware" : [
		"My retro shake brings all the boys to the yard.",
		"I'm off to get my Barnet sorted out. I’ll be the best looking lady at the gala.",
		"It's always all itsy bitsy with them boys at the Rub-a-Dub.",
		"I need to get this shopping sorted out.",
		"What a lovely evening. Perfect for skulking"
	    ],
	    "concerned" : [
		"Wha… what’s that? Who’s there?",
		"Did you hear that?",
		"Martha? Is that you?",
		"I don't want no tomfoolery. Go away!",
		"What was that? This is how horror theatre bits start…",
		"What's that?",
		"Did you see that?"
	    ],
	    "alerted" : [
		"Eeeek!",
		"Stay away from me!",
		"Guards! Guards!",
		"What in the nine hells?",
		"Get back or I'll swoon!",
		"Help! He's after me virtue!"
	    ],
	    "losthim" : [
		"Good riddance! There’s too many male protagonists in games anyhow!",
		"I sure am glad that’s over.",
		"This town is going straight to hell.",
		"I hope he doesn’t come back.",
		"I hope he’s caught and hanged!"
	    ]
	},
	"townsfolk-guard" : {
	    "unaware" : [
		"Just doing my civic duty.",
		"Good day, citizens.",
		"Honor. Liberty. Justice. Oh, and pancakes… I love pancakes.",
		"No loitering.",
		"I am the law.",
		"May Evil beware and may Good dress warmly and eat plenty of fresh vegetables.",
		"We're sworn to protect The City."
	    ],
	    "concerned" : [
		"I sense law-breaking abound.",
		"Did you hear something?",
		"Did you see that?",
		"I know you're around here somewhere, rat…",
		"Don't make me look for you in hard-to-reach places!",
		"The eyes play tricks like tiny, round devils."
	    ],
	    "alerted" : [
		"Surrender lawbreaker!",
		"Halt!",
		"Halt! In the name of the… umm, er… me!",
		"Prepare for justice, criminal!",
		"I am justice!",
		"There’s no escaping the law!",
		"Surrender thief!",
		"Prepare to taste steel!",
		"Clear the area! Nobody panic! I'll catch him!"
	    ],
	    "losthim" : [
		"I’ll get you next time, criminal scum.",
		"Defeat is a harsh mistress.",
		"Evil men may get away, but justice fights another day.",
		"Wickedness flees, evading the cold steel of righteousness."
	    ]
	}
    },
    "conversations": {
	"townsfolk-male": {
	    "townsfolk-female": [],
	    "townsfolk-male": [],
	    "townsfolk-guard": []
	},
	"townsfolk-female": {
	    "townsfolk-male": [],
	    "townsfolk-female": [],
	    "townsfolk-guard": [],
	},
	"townsfolk-guard": {
	    "townsfolk-male": [],
	    "townsfolk-female": [],
	    "townsfolk-guard": []
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

var AISprite = function(game, x, y, spritetype) {
    this.setWordBubble = function()
    {
	if ( this.bubble != null || this.sprite_group == undefined) {
	    return;
	}
	//this.bubble = game.add.group()
	aistate = this.state & ( STATE_UNAWARE | STATE_CONCERNED | STATE_ALERTED | STATE_LOSTHIM );
	switch ( aistate ) {
	    case STATE_UNAWARE: {
		aistate = "unaware";
		break;
	    }
	    case STATE_CONCERNED: {
		aistate = "concerned";
		break;
	    }
	    case STATE_ALERTED: {
		aistate = "alerted";
		break;
	    }
	    case STATE_LOSTHIM: {
		aistate = "losthim";
		break;
	    }
	}

	var mylines = moonlightDialog['status'][this.sprite_group][aistate];
	this.bubble_text = mylines[game.rnd.integerInRange(0, mylines.length)];
	this.bubble_style = {font: '12px Arial Bold', fill: '#ffffff', align: 'center'}
	this.bubble = game.add.text(this.x, this.y - 20, this.bubble_text, this.bubble_style);
	
	var GOFUCKYERSELF = function() {
	    this.clear_bubble = true;
	    console.log("GOFUCKYERSELF fired");
	}

	setTimeout(GOFUCKYERSELF, 20000);
    }

    this.update = function()
    {
	if ( game.rnd.integerInRange(0, 100) < 95 )
	    return;
	var running = false;
	if ( game.rnd.integerInRange(0, 100) > 90 ) {
	    running = true;
	}

	if ( game.rnd.integerInRange(0, 500) > 450 ) {
	    this.setWordBubble();
	}

	if ( this.bubble !== null ) {
	    this.bubble.destroy();
	    if ( this.clear_bubble == true ) {
		this.bubble = null;
		this.clear_bubble = false;
	    } else {
		this.bubble = game.add.text(this.x, this.y - 20, this.bubble_text, this.bubble_style);
	    }
	}

	switch ( game.rnd.integerInRange(0, 4) ) {
	    case 0: {
		setSpriteMovement(this, running, 'up');
		break;
	    }
	    case 1: {
		setSpriteMovement(this, running, 'down');
		break;
	    }
	    case 2: {
		setSpriteMovement(this, running, 'left');
		break;
	    }
	    case 3: {
		setSpriteMovement(this, running, 'right');
	    }
	}
    }

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
    this.bubble = null;
    this.clear_bubble = false;

    this.state = STATE_UNAWARE;
    Phaser.Sprite.call(this, game, x, y, spritenames_by_type[spritetype]); 
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    var ARGH = spritenames_by_type[spritetype];
    console.log(ARGH);
    ARGH = ARGH.split("-");
    this.sprite_group = ARGH[0] + "-" + ARGH[1];

    addAnimation(this, 'bipedwalkleft');
    addAnimation(this, 'bipedwalkright');
    addAnimation(this, 'bipedwalkup');
    addAnimation(this, 'bipedwalkdown');
    addAnimation(this, 'bipedrunleft');
    addAnimation(this, 'bipedrunright');
    addAnimation(this, 'bipedrunup');
    addAnimation(this, 'bipedrundown');
}

AISprite.prototype = Object.create(Phaser.Sprite.prototype);
AISprite.prototype.constructor = AISprite;

var GameState = function(game) {
}

function addAnimation(obj, anim)
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
    this.fpsText.fixedToCamera = true;

    // Create the wandering sprites
    this.aiSprites = game.add.group();
    for ( i = 0; i < 20 ; i++ ) {
	this.aiSprites.add(
	    new AISprite(game,
				game.rnd.integerInRange(0, game.width),
				game.rnd.integerInRange(0, game.height),
				game.rnd.integerInRange(0, 9)
			       )
	);
    }

    this.shadowTexture = game.add.bitmapData(game.world.width, game.world.height);
    // drop this lower to make the map darker
    this.shadowTextureColor = 'rgb(255, 255, 255)';

    // Create an object that will use the bitmap as a texture
    this.shadowSprite = game.add.image(0, 0, this.shadowTexture);

    // Set the blend mode to MULTIPLY. This will darken the colors of
    // everything below this sprite.
    this.shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;

    // Create the lights
    this.staticLights = game.add.group();
    // for (i = 0; i < 20 ; i++ ) {
    // 	this.staticLights.add(
    // 	    new Light(game,
    // 		      game.rnd.integerInRange(0, game.width),
    // 		      game.rnd.integerInRange(0, game.height),
    // 		      game.rnd.integerInRange(0, 128),
    // 		      game.rnd.realInRange(0.0, 1.0),
    // 		      [
    // 			  game.rnd.integerInRange(0, 255),
    // 			  game.rnd.integerInRange(0, 255),
    // 			  game.rnd.integerInRange(0, 255)
    // 		      ],
    // 		      flicker = [true, false][game.rnd.integerInRange(0, 1)]
    // 		 )
    // 	);
    // }
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

GameState.prototype.check_input = function()
{

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    velocityMod = 0;

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

GameState.prototype.update = function()
{
    if (game.time.fps !== 0) {
        this.fpsText.setText(game.time.fps + ' FPS');
    }

    this.check_input();
    this.physics.arcade.collide(player, layer);
    
    function _inner_collide(x) {
	this.physics.arcade.collide(x, layer);
	this.physics.arcade.collide(x, player);
    }

    this.aiSprites.forEach(_inner_collide, this);
    this.updateShadowTexture();
}

var game = new Phaser.Game(640, 480, Phaser.AUTO, '');
game.state.add('game', GameState, true);
