STATE_NONE = 0;
STATE_UNAWARE = 1 << 1;
STATE_CONCERNED = 1 << 2;
STATE_ALERTED = 1 << 3;
STATE_LOSTHIM = 1 << 4;

STATE_RUNNING = 1 << 5;
STATE_FACE_LEFT = 1 << 6;
STATE_FACE_RIGHT = 1 << 7;
STATE_FACE_UP = 1 << 8;
STATE_FACE_DOWN = 1 << 9;
STATE_MOVING = 1 << 10;

STATES_AWARENESS = (STATE_UNAWARE | STATE_CONCERNED | STATE_ALERTED | STATE_LOSTHIM);
STATES_MOVEMENT = (STATE_MOVING | STATE_RUNNING);
STATES_FACE = (STATE_FACE_LEFT | STATE_FACE_RIGHT | STATE_FACE_DOWN | STATE_FACE_UP);

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
var Light = function(game, x, y, key, frame, radius, fade, color_start, color_stop, flicker, always_render, light_meter) {
    color_start = ( typeof color_start == undefined ? color_start : 'rgba(255, 255, 255, 1.0)');
    color_stop = ( typeof color_stop == undefined ? color_stop : 'rgba(255, 255, 255, 0.0)');
    fade = ( typeof fade == undefined ? fade : 0.25);
    radius = ( typeof radius == undefined ? radius : 64);
    flicker = ( typeof flicker == undefined ? flicker : false);
    always_render = ( typeof always_render == undefined ? always_render : false);
    light_meter = ( typeof light_meter == undefined ? light_meter : 1.0 );
    Phaser.Sprite.call(this, game, x, y, null);

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    this.color_start = color_start;
    this.color_stop = color_stop;
    this.radius = radius;
    this.rendered_radius = radius;
    this.fade = radius * fade
    this.light_meter = light_meter;
    this.always_render = always_render
    this.rect = new Phaser.Rectangle(this.x - radius, this.y - radius, radius * 2, radius * 2)
    this.flicker = flicker;
};

// Lightes are a type of Phaser.Sprite
Light.prototype = Object.create(Phaser.Sprite.prototype);
Light.prototype.constructor = Light;

Light.prototype.update_new_values = function() {
    this.light_meter = Number(this.light_meter);
    this.radius = parseInt(this.radius);
    this.fade = this.radius * Number(this.fade);
    this.flicker = parseBoolean(this.flicker);
    this.always_render = parseBoolean(this.always_render);
    this.rect = new Phaser.Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
}

function SoundSprite(game, x, y, key, frame, 
		     sound_key, 
		     sound_marker, 
		     sound_position,
		     sound_volume, 
		     sound_loop, 
		     sound_forcerestart,
		     sound_distance,
		     sound_nofade)
{
    Phaser.Sprite.call(this, game, x, y, null);
    this.sound_key = sound_key;
    this.sound_marker = ( typeof sound_marker == undefined ? sound_marker : '');
    this.sound_volume = ( typeof sound_volume == undefined ? sound_volume : 1.0 );
    this.sound_position = ( typeof sound_position == undefined ? sound_position : 1.0 );
    this.sound_loop = ( typeof sound_loop == undefined ? sound_loop : true );
    this.sound_forcerestart = ( typeof sound_forcerestart == undefined ? sound_forcerestart : false );
    var def_distance = Math.sqrt(
	Number((game.camera.width/2) * (game.camera.width/2)) + 
	    Number((game.camera.height/2) * (game.camera.height/2))
    );
    this.sound_distance = ( typeof sound_distance == undefined ? sound_distance : def_distance);
    this.sound_nofade = (typeof sound_nofade == undefined ? sound_nofade : false);

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
    this.sound_position = parseInt(this.sound_position);
    this.sound_distance = Number(this.sound_distance);
    this.sound_volume = Number(this.sound_volume);
    this.sound_loop = parseBoolean(this.sound_loop);
    this.sound_forcerestart = parseBoolean(this.sound_forcerestart);
    this.sound_nofade = parseBoolean(this.sound_nofade);

    if ( this.sound !== null )
	this.sound.stop();
    this.sound = game.add.audio(this.sound_key, this.sound_volume, this.sound_loop);
    this.sound.play(
	this.sound_marker,
	this.sound_position,
	this.sound_volume,
	this.sound_loop,
	this.sound_forcerestart);
}

SoundSprite.prototype.adjust_relative_to = function(spr) {
    if ( this.sound_nofade == true ) {
	this.sound.volume = this.sound_volume;
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

    var hyp = Math.sqrt(Number(xd * xd) + Number(yd * yd));    

    this.sound.volume = (1.0 - Number(hyp / this.sound_distance));
    // Math.max doesn't work here??
    if ( this.sound.volume < 0 )
	this.sound.volume = 0;
    
}

var moonlightSettings = {
    'map' : {
	'tilesets': [
	    {
		'name': 'bigtop',
		'path': 'gfx/tiles/bigtop.png'
	    },
	    {
		'name': '002-Woods01',
		'path': 'gfx/tiles/002-Woods01.png'
	    },
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
	    '0 - NonCollide Overlay - Above Player (Short)': {
		'collides': false,
		'collisionBetween': [0, 9999],
		'type': 'tiles',
		'inject_sprites': false
	    },
	    '0 - NonCollide Overlay - Above Player (Tall)': {
		'collides': false,
		'collisionBetween': [0, 9999],
		'type': 'tiles',
		'inject_sprites': false
	    }
	},
	'path': 'gfx/map.json'
    },
    'sounds': [
	{
	    'name': 'fountain',
	    'path': 'sfx/fountain.wav'
	},
	{
	    'name': 'fire',
	    'path': 'sfx/fire.ogg'
	},
	{
	    'name': 'calliope',
	    'path': 'sfx/calliope.mp3'
	}
    ],
    'images': [
	{
	    'name': 'lightbox',
	    'path': 'gfx/ui/lightbox.png'
	},
	{
	    'name': 'lightbar',
	    'path': 'gfx/ui/lightbar.png'
	},
	{
	    'name': 'wordbubble',
	    'path': 'gfx/effects/wordbubble.png'
	}
    ],
    'spritesheets': [
	{
	    'name': 'flame',
	    'path': 'gfx/effects/flame.png',
	    'width': 32,
	    'height': 32,
	    'frames': 96
	},
	{
	    'name': 'balloon',
	    'path': 'gfx/effects/Balloon.png',
	    'width': 32,
	    'height': 32,
	    'frames': 80
	},
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
	'alerted': {
	    'frames': [0, 1, 2, 3, 4, 5, 6, 7],
	    'speed': 4,
	    'loop': false
	},
	'concerned': {
	    'frames': [8, 9, 10, 11, 12, 13, 14, 15],
	    'speed': 4,
	    'loop': false
	},
	'relieved': {
	    'frames': [40, 41, 42, 43, 44, 45, 46, 47],
	    'speed': 4,
	    'loop': false
	},
	'angry': {
	    'frames': [48, 49, 50, 51, 52, 53, 54, 55],
	    'speed': 4,
	    'loop': false
	},
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
	},
	'lantern_small': {
	    'frames': [24, 25, 26],
	    'speed': 6,
	    'loop': true
	},
	'campfire_small': {
	    'frames': [6, 7, 8],
	    'speed': 6,
	    'loop': true
	},
	'fire_small': {
	    'frames': [9, 10, 11],
	    'speed': 6,
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
		"Oi! Where'd that trouble run\noff to now then?",
		"The missus is off shoppin', and\nhere I am sittin' on\nme Jack Jones.",
		"Oy I'm gonna have a butcher’s at\nthat new tailor's knickers\nhe has for sale.",
		"I'm off to the pub to see the\nlads and chew the fat.",
		"♪ ♫ Whistling ♪ ♫"
	    ],
	    "concerned" : [
		"Wha… what’s that? Who’s there?",
		"Did you hear that?",
		"Either I’m hearin’ things, or I\nneed to stop drinkin’ midday.",
		"Oi? I don’t want no tomfoolery;\ncome out if you’re there!",
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
		"Stay away! I know Kung-fu! ... but\nthat would require bravery \nI don't have",
		"Guards! GUARDS!"
	    ],
	    "losthim" : [
		"Whew. Glad that’s over.",
		"I wasn’t scared!",
		"Must’ve been intimidated by\nmy manly physique.",
		"That’s right! Run away!",
		"Aye, and don’t-cha come back!",
		"Spoony Bard...",
		"Bloody wanker!"
	    ]
	},
	"townsfolk-female" : {
	    "unaware" : [
		"My retro shake brings all the\nboys to the yard.",
		"I'm off to get my Barnet sorted\nout. I’ll be the best looking\nlady at the gala.",
		"It's always all itsy bitsy with\nthem boys at the Rub-a-Dub.",
		"I need to get this shopping\nsorted out.",
		"What a lovely evening. Perfect\nfor skulking, I would imagine."
	    ],
	    "concerned" : [
		"Wha… what’s that? Who’s there?",
		"Did you hear that?",
		"Martha? Is that you?",
		"I don't want no tomfoolery.\nGo away!",
		"What was that? This is how horror\ntheatre bits start…",
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
		"Good riddance! There’s too many\nmale protagonists in\ngames anyhow!",
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
		"Honor. Liberty. Justice.\nOh, and pancakes…\nI love pancakes.",
		"No loitering.",
		"I am the law.",
		"May Evil beware and may\nGood dress warmly and\neat plenty of fresh vegetables.",
		"We're sworn to protect The City."
	    ],
	    "concerned" : [
		"I sense law-breaking abound.",
		"Did you hear something?",
		"Did you see that?",
		"I know you're around here\nsomewhere, rat…",
		"Don't make me look for\nyou in hard-to-reach places!",
		"The eyes play tricks\nlike tiny, round devils."
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
		"Clear the area! Nobody\npanic! I'll catch him!"
	    ],
	    "losthim" : [
		"I’ll get you next time,\ncriminal scum.",
		"Defeat is a harsh mistress.",
		"Evil men may get away, but\njustice fights another day.",
		"Wickedness flees, evading the\ncold steel of righteousness."
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

function stringSize(str, font)
{
    var f = font || '12px arial',
    o = $('<div>' + str + '</div>')
        .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
        .appendTo($('body')),
    w = o.width(),
    h = o.height();

    o.remove();
    return [w, h];
}

var EffectSprite = function(game, x, y, key, frame, animation) {
    this.update_new_values = function() {
	this.animations.destroy();
	this.loadTexture(this.sprite_key, 0);
	addAnimation(this, this.sprite_animation);
	this.animations.play(this.sprite_animation);
    }

    Phaser.Sprite.call(this, game, x, y, null);
    game.physics.arcade.enable(this);
    this.collide_with_map = true;
    this.collide_with_player = false;
}

EffectSprite.prototype = Object.create(Phaser.Sprite.prototype);
EffectSprite.prototype.constructor = EffectSprite;

var AISprite = function(game, x, y, key, frame) {
    this.viewRectangle = function() {
	var offset = [];
	var size = [];
	if ( hasState(this, STATE_FACE_LEFT) ) {
	    offset = [0, -32];
	    size = [-this.view_distance, 96];
	} else if ( hasState(this, STATE_FACE_RIGHT) ) {
	    offset = [32, -32];
	    size = [32 + this.view_distance, 96];
	} else if ( hasState(this, STATE_FACE_DOWN) ) {
	    offset = [-32, 0];
	    size = [96, this.view_distance];
	} else if ( hasState(this, STATE_FACE_UP) ) {
	    offset = [-32, 0];
	    size = [96, -this.view_distance];
	} else {
	    return null;
	}
	if ( hasState(this, STATE_ALERTED) ) {
	    offset = [offset[0] * 2, offset[1] * 2];
	    size = [size[0] * 2, size[1] * 2];
	}
	return new Phaser.Rectangle(this.x + offset[0],
				    this.y + offset[1],
				    size[0],
				    size[1]);
    }

    this.canSeeSprite = function(spr, debug) {
	var xd = (spr.x - this.x);
	if ( xd < 0 )
	    xd = -(xd);
	var yd = (spr.y - this.y);
	if ( yd < 0 )
	    yd = -(yd);

	var hyp = Math.sqrt(Number(xd * xd) + Number(yd * yd));
	if ( hyp > this.view_distance ) {
	    if ( debug == true )
		console.log(spr + " is too far away");
	    return false;
	}

	var viewrect = this.viewRectangle();
	if ( viewrect == null ) 
	    return false;
	var sprrect = new Phaser.Rectangle(spr.x, spr.y, 32, 32);
	if ( viewrect.intersects(sprrect) || viewrect.containsRect(sprrect) ) {
	    return true;
	}
	return false;
    }

    this.enableAwarenessChange = function(state) {
	this.awareness_change_enabled = true;
    }

    this.startAwarenessTimer = function() {
	this.awareness_change_enabled = false;
	if ( this.awareness_timer !== null )
	    this.awareness_timer.stop();
	this.awareness_timer = game.time.create(false);
	this.awareness_timer.add(this.sprite_awareness_duration, 
				 this.enableAwarenessChange, 
				 this);
	this.awareness_timer.start()
    }

    this.setAwarenessEffect = function(state) {
	var animkey = "";

	if ( hasState(this, state) == true ) {
	    // restart the awareness timer
	    this.startAwarenessTimer();
	    return;
	} else if ( (state == STATE_LOSTHIM) && 
		    (hasState(this, STATE_ALERTED) == false) &&
		    (hasState(this, STATE_CONCERNED) == false) ) {
	    return;
	} 

	if ( this.awareness_change_enabled == false &&
	     state != STATE_ALERTED ) {
	    return;
	}
	this.startAwarenessTimer();
	setAwarenessState(this, state);

	if ( this.awareness_effect !== null ) {
	    this.awareness_effect.alive = false;
	    this.awareness_effect.destroy();
	    this.awareness_effect = null;
	}
	if ( state == STATE_ALERTED ) {
	    animkey = "alerted";
	} else if ( state == STATE_CONCERNED ) {
	    animkey = "concerned";
	} else if ( state == STATE_LOSTHIM ) {
	    if ( this.sprite_group == "townsfolk-guard" ) {
		animkey = "angry";
	    } else {
		animkey = "relieved";
	    }
	}
	    
	if ( animkey == "" )
	    return;

	this.bubble_immediate = true;
	this.clearWordBubble();
	this.awareness_effect = game.state.states.game.add.sprite(
	    this.x + 16,
	    this.y - 16,
	    'balloon');
	addAnimation(this.awareness_effect, animkey);
	this.awareness_effect.play(animkey, null, false, true);
    }

    this.enableWordBubble = function() {
	this.enable_word_bubble = true;
	this.timer = game.time.create(false);
	if ( this.bubble_immediate == true ) {
	    this.bubble_immediate = false;
	    this.setWordBubble();
	} else {
	    var timerdelta = 10000 + (game.rnd.integerInRange(0, 20) * 1000);
	    timerev = this.timer.add(timerdelta, this.setWordBubble, this);
	    this.timer.start()
	}
    }

    this.clearWordBubble = function() {
	if ( this.bubble_text !== null )
	    this.clear_bubble = true;
	this.enable_word_bubble = false;
	this.timer = game.time.create(false);
	timerev = this.timer.add(1000, this.enableWordBubble, this);
	this.timer.start()
    }

    this.setWordBubble = function()
    {
	if ( this.bubble_text !== null || 
	     this.sprite_group == undefined || 
	     this.enable_world_bubble == false) {
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
	bubbleimg = game.cache.getImage('wordbubble');
	text = mylines[game.rnd.integerInRange(0, mylines.length-1)];
	style = {font: '14px Arial Bold', fill: '#ffffff'}
	this.text_size = stringSize(text, style['font']);
	bubblegrp = game.state.states.game.bubble_group;
	console.log(bubblegrp);
	console.log(bubbleimg);
	this.bubble_sprite = game.add.sprite(this.x, this.y, 'wordbubble', bubblegrp);
	this.bubble_sprite.anchor.setTo(0.5, 1.0);
	console.log(this.bubble_sprite.scale);
	this.bubble_sprite.scale.x = Number(this.text_size[0] / bubbleimg.width);
	this.bubble_sprite.scale.y = Number(this.text_size[1] / bubbleimg.height);
	console.log(this.bubble_sprite);
	this.bubble_text = game.add.text(this.x, this.y, text, style, bubblegrp);
	this.snap_bubble_position();

	this.timer = game.time.create(false);
	timerev = this.timer.add(5000, this.clearWordBubble, this);
	this.timer.start()
    }

    this.snap_bubble_position = function()
    {
	this.bubble_sprite.x = this.x + 16;
	this.bubble_sprite.y = this.y;
	var tx = this.bubble_sprite.x - (this.text_size[0]/2);
	var ty = this.bubble_sprite.y - (this.text_size[1]);
	this.bubble_text.position.x = tx;
	this.bubble_text.position.y = ty;
    }

    this.update = function()
    {
	var running = false;
	var newstate = STATE_NONE;

	if ( this.awareness_effect !== null ) {
	    if ( this.awareness_effect.alive == false ) {
		this.awareness_effect.destroy();
		this.awareness_effect = null;
	    } else {
		this.awareness_effect.x = this.x + 16;
		this.awareness_effect.y = this.y - 16;
	    }
	}

	if ( this.bubble_text !== null ) {
	    if ( this.clear_bubble == true ) {
		this.bubble_text.destroy();
		this.bubble_sprite.destroy();
		this.bubble_text = null;
		this.bubble_sprite = null;
		this.clear_bubble = false;
	    } else {
		this.snap_bubble_position();
	    }
	}

	if ( this.sprite_canmove == false) {
	    return;
	}
	if ( game.rnd.integerInRange(0, 100) < 95 )
	    return;
	if ( game.rnd.integerInRange(0, 100) > 90 ) {
	    newstate = STATE_RUNNING;
	}

	switch ( game.rnd.integerInRange(0, 4) ) {
	    case 0: {
		newstate = newstate | (STATE_FACE_RIGHT | STATE_MOVING);
		break;
	    }
	    case 1: {
		newstate = newstate | (STATE_FACE_LEFT | STATE_MOVING);
		break;
	    }
	    case 2: {
		newstate = newstate | (STATE_FACE_UP | STATE_MOVING);
		break;
	    }
	    case 3: {
		newstate = newstate | (STATE_FACE_DOWN | STATE_MOVING);
	    }
	}
	setMovingState(this, newstate);
	setSpriteMovement(this);
    }

    this.update_new_values = function() {
	console.log(this);
	if ( this.timer !== null )
	    this.timer.stop();
	this.animations.destroy();
	this.clearWordBubble();	
	this.state = STATE_UNAWARE;
	this.sprite_can_see_lightmeter = Number(this.sprite_can_see_lightmeter);
	this.sprite_canmove = parseBoolean(this.sprite_canmove);
	this.sprite_awareness_duration = parseInt(this.sprite_awareness_duration);
	this.collide_with_player = parseBoolean(this.collide_with_player);
	this.collide_with_map = parseBoolean(this.collide_with_map);
	this.carries_light = parseBoolean(this.carries_light);

	this.loadTexture(this.sprite_name, 0);
	addAnimation(this, 'bipedwalkleft');
	addAnimation(this, 'bipedwalkright');
	addAnimation(this, 'bipedwalkup');
	addAnimation(this, 'bipedwalkdown');
	addAnimation(this, 'bipedrunleft');
	addAnimation(this, 'bipedrunright');
	addAnimation(this, 'bipedrunup');
	addAnimation(this, 'bipedrundown');
	setMovingState(this, STATE_FACE_DOWN);
	setSpriteMovement(this);
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
    this.body.immovable = true;
    this.awareness_change_enabled = true;
    this.lightmeter = 1.0;
    this.sprite_can_see_lightmeter = 0.3;
    this.awareness_effect = null;
    this.awareness_timer = null;
    this.sprite_awareness_duration = 60000;
    this.sprite_canmove = 'true';
    this.collide_with_player = 'true';
    this.collide_with_map = 'true';
    this.carries_light = 'false';
    this.view_distance = 32 * 5;
    this.timer = null;
    this.bubble_immediate = false;
    this.bubble_text = null;
    this.enable_word_bubble = false;
    this.body.collideWorldBounds = true;
    this.sprite_name = "townsfolk-male-1";
    this.sprite_group = "townsfolk-male";
    this.update_new_values();
}

AISprite.prototype = Object.create(Phaser.Sprite.prototype);
AISprite.prototype.constructor = AISprite;

function rotatePoints(arr, x, y, degrees)
{
    arr.forEach(function(p) {
	p.rotate(x, y, degrees, true);
    }, this);
}

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
		this.map.createFromObjects('AI', 3544, 'player', 0, true, false, this.aiSprites, AISprite);
		this.aiSprites.forEach(function(spr) {
		    spr.update_new_values();
		}, this)
		player = this.add.sprite((19 * 32), (21 * 32), 'player');
		player.lightmeter = 0;

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

    this.effectSprites = game.add.group();
    this.map.createFromObjects('EffectSprites', 5, 'player', 0, true, false, this.effectSprites, EffectSprite);
    this.effectSprites.forEach(function(spr) {
	spr.update_new_values();
    }, this)

    this.shadowTexture = game.add.bitmapData(game.world.width, game.world.height);
    // drop this lower to make the map darker
    this.shadowTextureColor = 'rgb(40, 40, 40)';
    this.shadowSprite = game.add.image(0, 0, this.shadowTexture);

    this.shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;

    this.staticLights = game.add.group();
    this.map.createFromObjects('Lights', 97, 'player', 0, true, false, this.staticLights, Light);
    this.staticLights.forEach(function(light) {
	light.update_new_values();
    }, this)
			     
    this.staticSounds = game.add.group();
    this.map.createFromObjects('Sounds', 11, 'player', 0, true, false, this.staticSounds, SoundSprite);
    this.staticSounds.forEach(function(snd) {
	snd.update_new_values();
    }, this)

    this.bubble_group = game.add.group();

    this.uigroup = game.add.group();
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
        20, 20, '', { font: '16px Arial', fill: '#ffffff' }, this.uigroup
    );
    this.lightbox = this.game.add.image(game.camera.width / 2 - 50,
					game.camera.height - 40,
					'lightbox',
					0,
					this.uigroup);
    this.lightbar = this.game.add.image(this.lightbox.x + 3,
					this.lightbox.y + 3,
					'lightbar',
					0,
					this.uigroup);
    this.lightbar_image = game.cache.getImage('lightbar');
    this.lightbar_crop = new Phaser.Rectangle(0,
					      0,
					      this.lightbar_image.width,
					      this.lightbar_image.height);
    this.uigroup.setAll('fixedToCamera', true);	
}

GameState.prototype.updateShadowTexture = function() {
    this.shadowTexture.context.fillStyle = this.shadowTextureColor;
    this.shadowTexture.context.fillRect(0, 0, game.world.width, game.world.height);

    this.staticLights.forEach(function(light) {
	if ( light.always_render !== true ) {
            var r1 = new Phaser.Rectangle(this.game.camera.x,
                                          this.game.camera.y,
                                          this.game.camera.width,
                                          this.game.camera.height);
            if ( ! light.rect.intersects(r1) ) {
		return;
	    }
	}

	if ( light.flicker ) {
            var radius = light.radius + game.rnd.integerInRange(1,10);
	} else {
	    var radius = light.radius;
	}
	light.rendered_radius = radius;

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

function delState(spr, state)
{
    if ( hasState(spr, state) )
	spr.state = spr.state ^ state;
}

function addState(spr, state)
{
    spr.state = spr.state | state;
}

function setMovingState(spr, state)
{
    delState(spr, STATE_FACE_LEFT);
    delState(spr, STATE_FACE_RIGHT);
    delState(spr, STATE_FACE_DOWN);
    delState(spr, STATE_FACE_UP);
    delState(spr, STATE_MOVING);
    delState(spr, STATE_RUNNING);
    addState(spr, state);
}

function setAwarenessState(spr, state)
{
    delState(spr, STATE_UNAWARE);
    delState(spr, STATE_CONCERNED);
    delState(spr, STATE_ALERTED);
    delState(spr, STATE_LOSTHIM);
    addState(spr, state);
}

function exchangeState(spr, state1, state2)
{
    delState(spr, state1);
    addState(spr, state2);
}

function hasState(spr, state)
{
    if ( (spr.state & state) == state )
	return true;
    return false;
}

function spriteFacing(spr)
{
    if ( hasState(spr, STATE_FACE_LEFT) )
	return "left";
    if ( hasState(spr, STATE_FACE_RIGHT) )
	return "right";
    if ( hasState(spr, STATE_FACE_DOWN) )
	return "down";
    if ( hasState(spr, STATE_FACE_UP) )
	return "up";
}

function parseBoolean(val)
{
    return ( val == 'true' || val == true );
}

function setSpriteMovement(spr)
{
    var x = 0;
    var y = 0;
    var dir = spriteFacing(spr);

    spr.body.setSize(16, 16, 8, 16);

    if ( hasState(spr, STATE_RUNNING) ) {
	x = 200;
	y = 200;
	spr.animations.play("bipedrun" + dir);
    } else if ( hasState(spr, STATE_MOVING) ) {
	x = 75;
	y = 75;
	spr.animations.play("bipedwalk" + dir);
    } else {
	spr.body.velocity.x = 0;
	spr.body.velocity.y = 0;
	spr.animations.stop();
	return;
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
    var newstate = 0;

    if ( controls.up.isDown) {
	if ( controls.up.shiftKey ) {
	    newstate = (STATE_FACE_UP | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_UP | STATE_MOVING );
	}
    } else if ( controls.down.isDown ) {
	if ( controls.down.shiftKey ) {
	    newstate = (STATE_FACE_DOWN | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_DOWN | STATE_MOVING );
	}
    } else if ( controls.left.isDown ) {
	if ( controls.left.shiftKey ) {
	    newstate = (STATE_FACE_LEFT | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_LEFT | STATE_MOVING );
	}
    } else if ( controls.right.isDown ) {
	if ( controls.right.shiftKey ) {
	    newstate = (STATE_FACE_RIGHT | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_RIGHT | STATE_MOVING );
	}
    } else {
	newstate = STATE_NONE;
    }

    setMovingState(player, newstate);
    setSpriteMovement(player);
}

GameState.prototype.update_player_lightmeter = function() {
    lightValue = 0;
    this.staticLights.forEach(function(light) {
	var left = player.x;
	var top = player.y + 32;

	if ( player.y < this.y )
	    top = player.y;
	if ( player.x + this.x )
	    left = player.x + 32;

	line = new Phaser.Line(left, top, light.x + 16, light.y + 16);
	if ( line.length > light.rendered_radius)
	    return;
	var length = line.length;
	var lv = light.light_meter - (Number(length) / Number(light.rendered_radius));
	if ( lv > lightValue ) {
	    lightValue = lv;
	}
    }, this)
    player.lightmeter = lightValue;
    this.lightbar_crop.width = (this.lightbar_image.width * lightValue);
    this.lightbar.crop(this.lightbar_crop);
}

GameState.prototype.update = function()
{
    this.check_input();
    this.update_player_lightmeter();

    for (var ln in this.map_collision_layers ) {
	layer = this.map_collision_layers[ln];
	this.physics.arcade.collide(player, layer);
    }
    
    function _fix_audio_relative(x) {
	x.adjust_relative_to(player);
    }
    this.staticSounds.forEach(_fix_audio_relative, this);

    function _inner_collide(x) {
	if ( x.collide_with_map == true ) {
	    for ( var ln in this.map_collision_layers ) {
		layer = this.map_collision_layers[ln];
		this.physics.arcade.collide(x, layer);
	    }
	}
	if ( x.collide_with_player == false )
	    return;
	if ( x.canSeeSprite(player, false) == true ) {
	    if ( this.physics.arcade.collide(x, player) ) {
		x.setAwarenessEffect(STATE_ALERTED);
	    } else if ( player.lightmeter >= x.sprite_can_see_lightmeter ) {
		x.setAwarenessEffect(STATE_ALERTED);
	    } else {
		x.setAwarenessEffect(STATE_CONCERNED);
	    }
	    return;
	} else {
	    if ( hasState(x, STATE_LOSTHIM) == false ) {
		x.setAwarenessEffect(STATE_LOSTHIM);
	    } else {
		x.setAwarenessEffect(STATE_UNAWARE);
	    }
	}
	this.physics.arcade.collide(x, player);
    }

    this.effectSprites.forEach(_inner_collide, this);

    this.aiSprites.forEach(_inner_collide, this);
    this.updateShadowTexture();

    // function _draw_viewrect(x) {
    // 	var r = x.viewRectangle();
    // 	if ( r == null ) 
    // 	    return;
    // 	this.shadowTexture.context.fillStyle = 'rgb(128, 128, 128)';
    // 	this.shadowTexture.context.fillRect(r.left, 
    // 					    r.top, 
    // 					    r.width,
    // 					    r.height);
    // }
    // this.aiSprites.forEach(_draw_viewrect, this);

    if (game.time.fps !== 0) {
        this.fpsText.setText(game.time.fps + ' FPS');
    }
}

game.state.add('game', GameState, true);
