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
	    'name': 'hud',
	    'path': 'gfx/ui/hud.png'
	},
	{
	    'name': 'clock_overlay',
	    'path': 'gfx/ui/clock_overlay.png'
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
	    'name': 'clock_minutehand',
	    'path': 'gfx/ui/clock_minutehand.png',
	    'width': 64,
	    'height': 64,
	    'frames': 60
	},
	{
	    'name': 'clock_hourhand',
	    'path': 'gfx/ui/clock_hourhand.png',
	    'width': 64,
	    'height': 64,
	    'frames': 60
	},
	{
	    'name': 'flame',
	    'path': 'gfx/effects/flame.png',
	    'width': 32,
	    'height': 32,
	    'frames': 96
	},
	{
	    'name': 'glint',
	    'path': 'gfx/effects/glint.png',
	    'width': 16,
	    'height': 16,
	    'frames': 12
	},
	{
	    'name': 'treasure',
	    'path': 'gfx/sprites/treasure.png',
	    'width': 24,
	    'height': 24,
	    'frames': 368
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
	'glint': {
	    'frames': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	    'speed': 12,
	    'loop': false
	},
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
	    'frames': [1, 0, 1, 2],
	    'speed': 4,
	    'loop': true
	},
	'bipedwalkleft': {
	    'frames': [4, 3, 4, 5],
	    'speed': 4,
	    'loop': true
	},
	'bipedwalkright': {
	    'frames': [7, 6, 7, 8],
	    'speed': 4,
	    'loop': true
	},
	'bipedwalkup': {
	    'frames': [10, 9, 10, 11],
	    'speed': 4,
	    'loop': true
	},
	'bipedrundown': {
	    'frames': [1, 0, 1, 2],
	    'speed': 12,
	    'loop': true
	},
	'bipedrunleft': {
	    'frames': [4, 3, 4, 5],
	    'speed': 12,
	    'loop': true
	},
	'bipedrunright': {
	    'frames': [7, 6, 7, 8],
	    'speed': 12,
	    'loop': true
	},
	'bipedrunup': {
	    'frames': [10, 9, 10, 11],
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

var moonlightTreasures = {
    "silver ring with garnet": {
	"x": 6,
	"y": 1,
	"value": 50
    },
    "gold hairpin": {
	"x": 7,
	"y": 1,
	"value": 50
    },
    "gold ring with emerald": {
	"x": 0,
	"y": 2,
	"value": 75
    },
    "silver bangles": {
	"x": 1,
	"y": 2,
	"value": 50
    },
    "gold bracelets": {
	"x": 2,
	"y": 2,
	"value": 75
    },
    "gold brooch with sapphire": {
	"x": 3,
	"y": 2,
	"value": 75
    },
    "gold necklace with sapphire": {
	"x": 4,
	"y": 2,
	"value": 75
    },
    "tonic": {
	"x": 0,
	"y": 3,
	"value": 100
    },
    "antidote": {
	"x": 1,
	"y": 3,
	"value": 100
    },
    "cure-all": {
	"x": 2,
	"y": 3,
	"value": 100
    },
    "poison": {
	"x": 3,
	"y": 3,
	"value": 150
    },
    "perfume": {
	"x": 4,
	"y": 3,
	"value": 125
    },
    "spices": {
	"x": 6,
	"y": 3,
	"value": 125
    },
    "Fresh Spinach": {
	"x": 8,
	"y": 3,
	"value": 5
    },
    "Fresh Herbs": {
	"x": 9,
	"y": 3,
	"value": 5
    },
    "Flowers": {
	"x": 12,
	"y": 3,
	"value": 5
    },
    "Dirty Turnips": {
	"x": 14,
	"y": 3,
	"value": 5
    },
    "Whiskey": {
	"x": 12,
	"y": 4,
	"value": 10
    },
    "Map": {
	"x": 7,
	"y": 5,
	"value": 15
    },
    "Official Documents": {
	"x": 14,
	"y": 5,
	"value": 50
    },
    "Book": {
	"x": 0,
	"y": 5,
	"value": 25
    },
    "Gift": {
	"x": 3,
	"y": 7,
	"value": 50
    },
    "Bag of Money": {
	"x": 6,
	"y": 7,
	"value": 100
    },
    "Purse": {
	"x": 7,
	"y": 7,
	"value": 50
    },
    "Picnic Basket": {
	"x": 9,
	"y": 7,
	"value": 25
    },
    "Jewelry Box": {
	"x": 14,
	"y": 7,
	"value": 100
    },
    "Music Box": {
	"x": 15,
	"y": 6,
	"value": 300
    },
    "Hourglass": {
	"x": 8,
	"y": 8,
	"value": 100
    },
    "Holy Symbol": {
	"x": 9,
	"y": 8,
	"value": 200
    },
    "Large Mirror": {
	"x": 10,
	"y": 8,
	"value": 200
    },
    "Small Mirror": {
	"x": 11,
	"y": 8,
	"value": 100
    },
    "Cat's Eye": {
	"x": 4,
	"y": 12,
	"value": 200
    },
    "Pink Spinel": {
	"x":  5,
	"y": 12,
	"value": 200
    },
    "Quartz": {
	"x": 6,
	"y": 12,
	"value": 100
    },
    "Diamond": {
	"x": 9,
	"y": 12,
	"value": 400
    },
    "Emerald": {
	"x": 11,
	"y": 12,
	"value": 300
    },
    "Ruby": {
	"x": 7,
	"y": 13,
	"value": 250
    },
    "Pearl": {
	"x": 8,
	"y": 13,
	"value": 400
    },
    "Gold Bars": {
	"x": 9,
	"y": 13,
	"value": 500
    },
    "Gold Coin": {
	"x": 10,
	"y": 13,
	"value": 5
    }
};
