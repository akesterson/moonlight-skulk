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

var game = new Phaser.Game(640, 480, Phaser.AUTO, '');

// Create torch objects
// Light constructor
var Light = function(game, x, y, key, frame, radius, fade, color_start, color_stop, flicker, always_render) {
    color_start = ( typeof color_start == undefined ? color_start : 'rgba(255, 255, 255, 1.0)');
    color_stop = ( typeof color_stop == undefined ? color_stop : 'rgba(255, 255, 255, 0.0)');
    fade = ( typeof fade == undefined ? fade : 0.25);
    radius = ( typeof radius == undefined ? radius : 64);
    flicker = ( typeof flicker == undefined ? flicker : false);
    always_render = ( typeof always_render == undefined ? always_render : false);

    Phaser.Sprite.call(this, game, x, y, null);

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    this.color_start = color_start;
    this.color_stop = color_stop;
    this.radius = radius;
    this.fade = radius * fade
    this.always_render = always_render
    this.rect = new Phaser.Rectangle(this.x - radius, this.y - radius, radius * 2, radius * 2)
    this.flicker = flicker;
    console.log(this);
};

// Lightes are a type of Phaser.Sprite
Light.prototype = Object.create(Phaser.Sprite.prototype);
Light.prototype.constructor = Light;

Light.prototype.update_new_values = function() {
    this.radius = parseInt(this.radius);
    this.fade = this.radius * Number(this.fade);
    this.flicker = Boolean(this.flicker);
    this.always_render = Boolean(this.always_render)
    this.rect = new Phaser.Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
}


var moonlightSettings = {
    'map' : {
	'tilesets': [
	    {
		'name': '009-CastleTown01',
		'path': 'gfx/tiles/009-CastleTown01.png'
	    },
	    {
		'name': '010-CastleTown02',
		'path': 'gfx/tiles/010-CastleTown02.png'
	    },
	    {
		'name': '025-Castle01',
		'path': 'gfx/tiles/025-Castle01.png'
	    },
	    {
		'name': '026-Castle02',
		'path': 'gfx/tiles/026-Castle02.png'
	    },
	    {
		'name': '027-Castle03',
		'path': 'gfx/tiles/027-Castle03.png'
	    },
	    {
		'name': '027-Castle03',
		'path': 'gfx/tiles/027-Castle03.png'
	    },
	    {
		'name': '028-Church01',
		'path': 'gfx/tiles/028-Church01.png'
	    },
	    {
		'name': '029-Church02',
		'path': 'gfx/tiles/029-Church02.png'
	    },
	    {
		'name': '034-Bridge01',
		'path': 'gfx/tiles/034-Bridge01.png'
	    },
	    {
		'name': '035-Ruins01',
		'path': 'gfx/tiles/035-Ruins01.png'
	    },
	    {
		'name': '037-Fort01',
		'path': 'gfx/tiles/037-Fort01.png'
	    },
	    {
		'name': '038-Fort02',
		'path': 'gfx/tiles/038-Fort02.png'
	    },
	    {
		'name': '039-Tower01',
		'path': 'gfx/tiles/039-Tower01.png'
	    },
	    {
		'name': '040-Tower02',
		'path': 'gfx/tiles/040-Tower02.png'
	    },
	    {
		'name': '041-EvilCastle01',
		'path': 'gfx/tiles/041-EvilCastle01.png'
	    },
	    {
		'name': '042-EvilCastle02',
		'path': 'gfx/tiles/042-EvilCastle02.png'
	    },
	    {
		'name': '048-Sewer01',
		'path': 'gfx/tiles/048-Sewer01.png'
	    },
	    {
		'name': '004-Mountain01',
		'path': 'gfx/tiles/004-Mountain01.png'
	    }
	],
	'layers': {
	    '0 - NonCollide Base': {
		'collides': false,
		'collisionBetween': [0, 0],
		'type': 'tiles',
		'inject_sprites': false
	    },
	    '0 - Collide Base': {
		'collides': true,
		'collisionBetween': [0, 9999],
		'type': 'tiles',
		'inject_sprites': false
	    },
	    '0 - NonCollide Overlay - Pathways': {
		'collides': false,
		'collisionBetween': [0, 9999],
		'type': 'tiles',
		'inject_sprites': false
	    },
	    '0 - Collide Overlay - Ground Objects': {
		'collides': true,
		'collisionBetween': [0, 9999],
		'type': 'tiles',
		'inject_sprites': true
	    },
	    '0 - NonCollide Overlay - Above Player': {
		'collides': false,
		'collisionBetween': [0, 9999],
		'type': 'tiles',
		'inject_sprites': false
	    }
	},
	'path': 'gfx/map.json'
    },
    'images': [
	{
	    'name': 'simplelight',
	    'path': 'gfx/lights/light-white-256px.png'
	},
	{
	    "name": "townsfolk-female/alerted/1.png",
	    "path": "gfx/bubbles/townsfolk-female/alerted/1.png"
	},
	{
	    "name": "townsfolk-female/alerted/2.png",
	    "path": "gfx/bubbles/townsfolk-female/alerted/2.png"
	},
	{
	    "name": "townsfolk-female/alerted/3.png",
	    "path": "gfx/bubbles/townsfolk-female/alerted/3.png"
	},
	{
	    "name": "townsfolk-female/alerted/4.png",
	    "path": "gfx/bubbles/townsfolk-female/alerted/4.png"
	},
	{
	    "name": "townsfolk-female/alerted/5.png",
	    "path": "gfx/bubbles/townsfolk-female/alerted/5.png"
	},
	{
	    "name": "townsfolk-female/alerted/6.png",
	    "path": "gfx/bubbles/townsfolk-female/alerted/6.png"
	},
	{
	    "name": "townsfolk-female/concerned/2.png",
	    "path": "gfx/bubbles/townsfolk-female/concerned/2.png"
	},
	{
	    "name": "townsfolk-female/concerned/3.png",
	    "path": "gfx/bubbles/townsfolk-female/concerned/3.png"
	},
	{
	    "name": "townsfolk-female/concerned/4.png",
	    "path": "gfx/bubbles/townsfolk-female/concerned/4.png"
	},
	{
	    "name": "townsfolk-female/concerned/6.png",
	    "path": "gfx/bubbles/townsfolk-female/concerned/6.png"
	},
	{
	    "name": "townsfolk-female/concerned/7.png",
	    "path": "gfx/bubbles/townsfolk-female/concerned/7.png"
	},
	{
	    "name": "townsfolk-female/losthim/3.png",
	    "path": "gfx/bubbles/townsfolk-female/losthim/3.png"
	},
	{
	    "name": "townsfolk-female/unaware/1.png",
	    "path": "gfx/bubbles/townsfolk-female/unaware/1.png"
	},
	{
	    "name": "townsfolk-female/unaware/3.png",
	    "path": "gfx/bubbles/townsfolk-female/unaware/3.png"
	},
	{
	    "name": "townsfolk-female/unaware/4.png",
	    "path": "gfx/bubbles/townsfolk-female/unaware/4.png"
	},
	{
	    "name": "townsfolk-female/unaware/5.png",
	    "path": "gfx/bubbles/townsfolk-female/unaware/5.png"
	},
	{
	    "name": "townsfolk-guard/alerted/1.png",
	    "path": "gfx/bubbles/townsfolk-guard/alerted/1.png"
	},
	{
	    "name": "townsfolk-guard/alerted/2.png",
	    "path": "gfx/bubbles/townsfolk-guard/alerted/2.png"
	},
	{
	    "name": "townsfolk-guard/alerted/4.png",
	    "path": "gfx/bubbles/townsfolk-guard/alerted/4.png"
	},
	{
	    "name": "townsfolk-guard/alerted/5.png",
	    "path": "gfx/bubbles/townsfolk-guard/alerted/5.png"
	},
	{
	    "name": "townsfolk-guard/alerted/7.png",
	    "path": "gfx/bubbles/townsfolk-guard/alerted/7.png"
	},
	{
	    "name": "townsfolk-guard/alerted/8.png",
	    "path": "gfx/bubbles/townsfolk-guard/alerted/8.png"
	},
	{
	    "name": "townsfolk-guard/alerted/9.png",
	    "path": "gfx/bubbles/townsfolk-guard/alerted/9.png"
	},
	{
	    "name": "townsfolk-guard/concerned/1.png",
	    "path": "gfx/bubbles/townsfolk-guard/concerned/1.png"
	},
	{
	    "name": "townsfolk-guard/concerned/2.png",
	    "path": "gfx/bubbles/townsfolk-guard/concerned/2.png"
	},
	{
	    "name": "townsfolk-guard/concerned/3.png",
	    "path": "gfx/bubbles/townsfolk-guard/concerned/3.png"
	},
	{
	    "name": "townsfolk-guard/concerned/5.png",
	    "path": "gfx/bubbles/townsfolk-guard/concerned/5.png"
	},
	{
	    "name": "townsfolk-guard/concerned/6.png",
	    "path": "gfx/bubbles/townsfolk-guard/concerned/6.png"
	},
	{
	    "name": "townsfolk-guard/losthim/2.png",
	    "path": "gfx/bubbles/townsfolk-guard/losthim/2.png"
	},
	{
	    "name": "townsfolk-guard/losthim/3.png",
	    "path": "gfx/bubbles/townsfolk-guard/losthim/3.png"
	},
	{
	    "name": "townsfolk-guard/losthim/4.png",
	    "path": "gfx/bubbles/townsfolk-guard/losthim/4.png"
	},
	{
	    "name": "townsfolk-guard/unaware/1.png",
	    "path": "gfx/bubbles/townsfolk-guard/unaware/1.png"
	},
	{
	    "name": "townsfolk-guard/unaware/2.png",
	    "path": "gfx/bubbles/townsfolk-guard/unaware/2.png"
	},
	{
	    "name": "townsfolk-guard/unaware/4.png",
	    "path": "gfx/bubbles/townsfolk-guard/unaware/4.png"
	},
	{
	    "name": "townsfolk-guard/unaware/5.png",
	    "path": "gfx/bubbles/townsfolk-guard/unaware/5.png"
	},
	{
	    "name": "townsfolk-guard/unaware/6.png",
	    "path": "gfx/bubbles/townsfolk-guard/unaware/6.png"
	},
	{
	    "name": "townsfolk-guard/unaware/7.png",
	    "path": "gfx/bubbles/townsfolk-guard/unaware/7.png"
	},
	{
	    "name": "townsfolk-male/alerted/10.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/10.png"
	},
	{
	    "name": "townsfolk-male/alerted/11.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/11.png"
	},
	{
	    "name": "townsfolk-male/alerted/1.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/1.png"
	},
	{
	    "name": "townsfolk-male/alerted/2.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/2.png"
	},
	{
	    "name": "townsfolk-male/alerted/4.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/4.png"
	},
	{
	    "name": "townsfolk-male/alerted/5.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/5.png"
	},
	{
	    "name": "townsfolk-male/alerted/6.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/6.png"
	},
	{
	    "name": "townsfolk-male/alerted/7.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/7.png"
	},
	{
	    "name": "townsfolk-male/alerted/8.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/8.png"
	},
	{
	    "name": "townsfolk-male/alerted/9.png",
	    "path": "gfx/bubbles/townsfolk-male/alerted/9.png"
	},
	{
	    "name": "townsfolk-male/concerned/2.png",
	    "path": "gfx/bubbles/townsfolk-male/concerned/2.png"
	},
	{
	    "name": "townsfolk-male/concerned/5.png",
	    "path": "gfx/bubbles/townsfolk-male/concerned/5.png"
	},
	{
	    "name": "townsfolk-male/concerned/7.png",
	    "path": "gfx/bubbles/townsfolk-male/concerned/7.png"
	},
	{
	    "name": "townsfolk-male/losthim/6.png",
	    "path": "gfx/bubbles/townsfolk-male/losthim/6.png"
	},
	{
	    "name": "townsfolk-male/losthim/7.png",
	    "path": "gfx/bubbles/townsfolk-male/losthim/7.png"
	},
	{
	    "name": "townsfolk-male/unaware/1.png",
	    "path": "gfx/bubbles/townsfolk-male/unaware/1.png"
	},
	{
	    "name": "townsfolk-male/unaware/2.png",
	    "path": "gfx/bubbles/townsfolk-male/unaware/2.png"
	},
	{
	    "name": "townsfolk-male/unaware/3.png",
	    "path": "gfx/bubbles/townsfolk-male/unaware/3.png"
	},
	{
	    "name": "townsfolk-male/unaware/4.png",
	    "path": "gfx/bubbles/townsfolk-male/unaware/4.png"
	},
	{
	    "name": "townsfolk-male/unaware/6.png",
	    "path": "gfx/bubbles/townsfolk-male/unaware/6.png"
	},
	{
	    "name": "townsfolk-male/unaware/7.png",
	    "path": "gfx/bubbles/townsfolk-male/unaware/7.png"
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
		"townsfolk-male/unaware/1.png",
		"townsfolk-male/unaware/2.png",
		"townsfolk-male/unaware/3.png",
		"townsfolk-male/unaware/4.png",
		"townsfolk-male/unaware/6.png",
		"townsfolk-male/unaware/7.png"
	    ],
	    "concerned" : [
		"townsfolk-male/concerned/2.png",
		"townsfolk-male/concerned/5.png",
		"townsfolk-male/concerned/7.png"
	    ],
	    "alerted" : [
		"townsfolk-male/alerted/10.png",
		"townsfolk-male/alerted/11.png",
		"townsfolk-male/alerted/1.png",
		"townsfolk-male/alerted/2.png",
		"townsfolk-male/alerted/4.png",
		"townsfolk-male/alerted/5.png",
		"townsfolk-male/alerted/6.png",
		"townsfolk-male/alerted/7.png",
		"townsfolk-male/alerted/8.png",
		"townsfolk-male/alerted/9.png"		
	    ],
	    "losthim" : [
		"townsfolk-male/losthim/6.png",
		"townsfolk-male/losthim/7.png"
	    ]
	},
	"townsfolk-female" : {
	    "unaware" : [
		"townsfolk-female/unaware/1.png",
		"townsfolk-female/unaware/3.png",
		"townsfolk-female/unaware/4.png",
		"townsfolk-female/unaware/5.png"
	    ],
	    "concerned" : [
		"townsfolk-female/concerned/2.png",
		"townsfolk-female/concerned/3.png",
		"townsfolk-female/concerned/4.png",
		"townsfolk-female/concerned/6.png",
		"townsfolk-female/concerned/7.png"	    ],
	    "alerted" : [
		"townsfolk-female/alerted/1.png",
		"townsfolk-female/alerted/2.png",
		"townsfolk-female/alerted/3.png",
		"townsfolk-female/alerted/4.png",
		"townsfolk-female/alerted/5.png",
		"townsfolk-female/alerted/6.png"
	    ],
	    "losthim" : [
		"townsfolk-female/losthim/3.png"
	    ]
	},
	"townsfolk-guard" : {
	    "unaware" : [
		"townsfolk-guard/unaware/1.png",
		"townsfolk-guard/unaware/2.png",
		"townsfolk-guard/unaware/4.png",
		"townsfolk-guard/unaware/5.png",
		"townsfolk-guard/unaware/6.png",
		"townsfolk-guard/unaware/7.png"
	    ],
	    "concerned" : [
		"townsfolk-guard/concerned/1.png",
		"townsfolk-guard/concerned/2.png",
		"townsfolk-guard/concerned/3.png",
		"townsfolk-guard/concerned/5.png",
		"townsfolk-guard/concerned/6.png"
	    ],
	    "alerted" : [
		"townsfolk-guard/alerted/1.png",
		"townsfolk-guard/alerted/2.png",
		"townsfolk-guard/alerted/4.png",
		"townsfolk-guard/alerted/5.png",
		"townsfolk-guard/alerted/7.png",
		"townsfolk-guard/alerted/8.png",
		"townsfolk-guard/alerted/9.png"    
	    ],
	    "losthim" : [
		"townsfolk-guard/losthim/2.png",
		"townsfolk-guard/losthim/3.png",
		"townsfolk-guard/losthim/4.png"
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

var AISprite = function(game, x, y, spritetype) {
    this.enableWordBubble = function() {
	this.enable_word_bubble = true;
    }

    this.clearWordBubble = function() {
	if ( this.bubble !== null )
	    this.bubble.destroy();
	this.bubble = null;
	this.enable_word_bubble = false;
	timer = game.time.create(false);
	timerev = timer.add(20000 + (game.rnd.integerInRange(0, 30) * 1000), this.enableWordBubble, this);
	timer.start()
    }

    this.setWordBubble = function()
    {
	if ( this.bubble !== null || this.sprite_group == undefined || this.enable_word_bubble == false) {
	    return;
	}
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
	var myline = mylines[game.rnd.integerInRange(0, mylines.length)]
	this.bubble = game.add.sprite(this.x, this.y, myline);
	game.physics.arcade.enable(this.bubble);
	
	this.bubble.x = this.x - (this.bubble.width / 2);
	this.bubble.y = this.y - (this.bubble.height);

	timer = game.time.create(false);
	timerev = timer.add(5000, this.clearWordBubble, this);
	timer.start()
    }

    this.update = function()
    {
	var running = false;

	if ( game.rnd.integerInRange(0, 500) > 450 ) {
	    this.setWordBubble();
	}

	if ( this.bubble !== null ) {
	    this.bubble.body.velocity.x = this.body.velocity.x;
	    this.bubble.body.velocity.y = this.body.velocity.y;
	    //this.bubble.x = this.x - (this.bubble.width / 2);
	    //this.bubble.y = this.y - (this.bubble.height);
	}

	if ( game.rnd.integerInRange(0, 100) < 95 )
	    return;
	if ( game.rnd.integerInRange(0, 100) > 90 ) {
	    running = true;
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
    
    this.clearWordBubble();

    this.state = STATE_UNAWARE;
    Phaser.Sprite.call(this, game, x, y, spritenames_by_type[spritetype]); 
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    var ARGH = spritenames_by_type[spritetype];
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
    this.map = this.add.tilemap('map');
    for (var k in moonlightSettings['map']['tilesets']) {
	var ts = moonlightSettings['map']['tilesets'][k];
	this.map.addTilesetImage(ts['name']);
    }

    this.map_collision_layers = [];

    for (var ln in moonlightSettings['map']['layers']) {
	lp = moonlightSettings['map']['layers'][ln];
	if ( lp['type'] == "tiles" ) {
	    layer = this.map.createLayer(ln);
	    this.map.setCollisionBetween(
		lp['collisionBetween'][0],
		lp['collisionBetween'][1],
		lp['collides'],
		ln
	    );
	    if ( lp['inject_sprites'] == true ) {
		this.aiSprites = game.add.group();
		player = this.add.sprite((20 * 32), (25 * 32), 'player');
	    };
	    if ( lp['collides'] == true ) {
		this.map_collision_layers.push(layer);
	    }
	    layer.resizeWorld();
	}
    }
	
    this.physics.arcade.enable(player);
    player.body.center = new Phaser.Point(player.body.width / 2, player.body.height + player.body.halfHeight);
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
    // for ( i = 0; i < 50 ; i++ ) {
    // 	this.aiSprites.add(
    // 	    new AISprite(game,
    // 				game.rnd.integerInRange(0, game.world.width),
    // 				game.rnd.integerInRange(0, game.world.height),
    // 				game.rnd.integerInRange(0, 9)
    // 			       )
    // 	);
    // }

    this.shadowTexture = game.add.bitmapData(game.world.width, game.world.height);
    // drop this lower to make the map darker
    this.shadowTextureColor = 'rgb(30, 30, 30)';
    //this.shadowTextureColor = 'rgb(255, 255, 255)';

    // Create an object that will use the bitmap as a texture
    this.shadowSprite = game.add.image(0, 0, this.shadowTexture);

    // Set the blend mode to MULTIPLY. This will darken the colors of
    // everything below this sprite.
    this.shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;

    // Create the lights
    this.staticLights = game.add.group();
    this.map.createFromObjects('Lights', 97, 'player', 0, true, false, this.staticLights, Light);
    this.staticLights.forEach(function(light) {
	light.update_new_values();
	console.log(light);
    }, this)
			     
    // for (i = 0; i < 50 ; i++ ) {
    // 	this.staticLights.add(
    // 	    new Light(game,
    // 		      game.rnd.integerInRange(0, game.world.width),
    // 		      game.rnd.integerInRange(0, game.world.height),
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
	if ( light.always_render !== true ) {
	    var r1 = new Phaser.Rectangle(this.game.camera.x, 
					  this.game.camera.y, 
					  this.game.camera.width, 
					  this.game.camera.height);
	    if ( ! light.rect.intersects(r1) ) {
		console.log("Light does not appear on camera");
		return;
	    }
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
        gradient.addColorStop(0, light.color_start);
        gradient.addColorStop(1, light.color_stop);

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
    player.body.setSize(spr.body.width/2, spr.body.height/4, spr.body.width/4, (spr.body.height * 0.75));

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
    this.check_input();
    
    for (var ln in this.map_collision_layers ) {
	layer = this.map_collision_layers[ln];
	this.physics.arcade.collide(player, layer);
    }
    
    function _inner_collide(x) {
	for ( var ln in this.map_collision_layers ) {
	    layer = this.map_collision_layers[ln];
	    this.physics.arcade.collide(x, layer);
	}
	this.physics.arcade.collide(x, player);
    }

    this.aiSprites.forEach(_inner_collide, this);
    this.updateShadowTexture();
    if (game.time.fps !== 0) {
        this.fpsText.setText(game.time.fps + ' FPS');
    }
}

game.state.add('game', GameState, true);
