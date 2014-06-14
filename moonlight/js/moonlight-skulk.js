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

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

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

function SoundSprite(game, x, y, key, frame, 
		     sound_key, 
		     sound_marker, 
		     sound_position,
		     sound_volume, 
		     sound_loop, 
		     sound_forcerestart,
		     sound_nofade)
{
    Phaser.Sprite.call(this, game, x, y, null);
    this.sound_key = sound_key;
    this.sound_marker = ( typeof sound_marker == undefined ? sound_marker : '');
    this.sound_volume = ( typeof sound_volume == undefined ? sound_volume : 1.0 );
    this.sound_position = ( typeof sound_position == undefined ? sound_position : 1.0 );
    this.sound_loop = ( typeof sound_loop == undefined ? sound_loop : true );
    this.sound_forcerestart = ( typeof sound_forcerestart == undefined ? sound_forcerestart : true );
    this.sound_nofade = (typeof sound_alwaysplay == undefined ? sound_alwaysplay : false);

    this.max_edge_dist = new Phaser.Point();
    this.max_edge_dist.x = game.camera.width / 2;
    this.max_edge_dist.y = game.camera.height / 2;
    this.sound = null;
}

SoundSprite.prototype = Object.create(Phaser.Sprite.prototype);
SoundSprite.prototype.constructor = Light;

SoundSprite.prototype.update_new_values = function() {
    if ( this.sound_key == null ) {
	if ( this.sound !== null ) {
	    this.sound.stop();
	}
	return;
    }
    this.sound = game.add.audio(this.sound_key);
    this.sound.play(
	this.sound_marker,
	this.sound_position,
	this.sound_volume,
	this.sound_loop,
	this.sound_forcerestart);
    console.log("Sound should be playing");
}

SoundSprite.prototype.adjust_relative_to = function(spr) {
    if ( this.sound_nofade == true ) {
	this.sound.volume = 1.0;
	return;
    }

    // The volume of any given sound is equal to the length of the
    // hypotenuse of a triangle drawn from the point (p) to the 
    // sprite in question

    var xd = (spr.x - this.x);
    if ( xd < 0 )
	xd = -(xd);
    var yd = (spr.y - this.y);
    if ( yd < 0 )
	yd = -(yd);
    var hyp = Math.sqrt((xd * xd) + (yd * yd));
    var hyp_perfect = Math.sqrt(
	((game.camera.width/2) * (game.camera.width/2)) + 
	    ((game.camera.height/2) * (game.camera.height/2))
    );
    this.sound.volume = Number(hyp_perfect / hyp);
    console.log([hyp_perfect, hyp, this.sound.volume]);
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
	    },
	    {
		'name': '!Door1',
		'path': 'gfx/tiles/Doors.png'
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
	    '0 - NonCollide Overlay - Below Player': {
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
	'path': 'gfx/bigmap.json'
    },
    'sounds': [
	{
	    'name': 'fountain',
	    'path': 'sfx/fountain.wav'
	},
	{
	    'name': 'background_music',
	    'path': 'bgm/Basement Floor.mp3'
	}
    ],
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

var AISprite = function(game, x, y, key, frame) {
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

    this.update_new_values = function() {
	this.animations.destroy();
	this.bubble = null;
	this.clearWordBubble();	
	this.state = STATE_UNAWARE;

	this.loadTexture(this.sprite_name, 0);
	addAnimation(this, 'bipedwalkleft');
	addAnimation(this, 'bipedwalkright');
	addAnimation(this, 'bipedwalkup');
	addAnimation(this, 'bipedwalkdown');
	addAnimation(this, 'bipedrunleft');
	addAnimation(this, 'bipedrunright');
	addAnimation(this, 'bipedrunup');
	addAnimation(this, 'bipedrundown');
	setSpriteMovement(this, false, 'down');
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
    Phaser.Sprite.call(this, game, x, y, null); 
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;

    this.sprite_name = "townsfolk-male-1";
    this.sprite_group = "townsfolk-male";
    this.update_new_values();
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
    for (var k in moonlightSettings['sounds']) {
	var s = moonlightSettings['sounds'][k];
	this.load.audio(s['name'], s['path']);
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

		this.map.createFromObjects('AI', 3544, 'player', 0, true, false, this.aiSprites, AISprite);
		this.aiSprites.forEach(function(spr) {
		    spr.update_new_values();
		    console.log(spr);
		}, this)
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


    this.shadowTexture = game.add.bitmapData(game.world.width, game.world.height);
    // drop this lower to make the map darker
    this.shadowTextureColor = 'rgb(40, 40, 40)';
    this.shadowSprite = game.add.image(0, 0, this.shadowTexture);

    this.shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;

    this.staticLights = game.add.group();
    this.map.createFromObjects('Lights', 97, 'player', 0, true, false, this.staticLights, Light);
    this.staticLights.forEach(function(light) {
	light.update_new_values();
	console.log(light);
    }, this)
			     
    this.staticSounds = game.add.group();
    this.map.createFromObjects('Sounds', 11, 'player', 0, true, false, this.staticSounds, SoundSprite);
    this.staticSounds.forEach(function(snd) {
	snd.update_new_values();
	console.log(snd);
    }, this)
}

GameState.prototype.updateShadowTexture = function() {
    this.shadowTexture.context.fillStyle = this.shadowTextureColor;
    this.shadowTexture.context.fillRect(0, 0, game.world.width, game.world.height);

    this.staticLights.forEach(function(light) {
	if ( light.always_render !== true ) {
	    if ( ! light.inCamera ) {
		console.log("Light does not appear on camera");
		return;
	    }
	}

	if ( light.flicker ) {
            var radius = light.radius + game.rnd.integerInRange(1,10);
	} else {
	    var radius = light.radius;
	}

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
    spr.body.setSize(16, 16, 8, 16);
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
    
    function _fix_audio_relative(x) {
	x.adjust_relative_to(this.player);
    }
    this.staticSounds.forEach(_fix_audio_relative, this);


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
