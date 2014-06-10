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
	{ 'name': 'moogle',
	  'path': 'gfx/moogle.png'
	}
    ],
    'spritesheets': [
    ]
};

function preload()
{    
    console.log(moonlightSettings);
    for (var k in moonlightSettings['map']['tilesets']) {
	var ts = moonlightSettings['map']['tilesets'][k];
	this.load.image(ts['name'], ts['path']);
    }
    for (var k in moonlightSettings['images']) {
	var i = moonlightSettings['images'][k];
	this.load.image(i['name'], i['path']);
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

    player = this.add.sprite(10, 10, 'moogle');
    this.physics.arcade.enable(player);
    this.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    controls = game.input.keyboard.createCursorKeys();
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

    if ( controls.up.isDown) {
	player.body.velocity.y = -200;
    } else if ( controls.down.isDown ) {
	player.body.velocity.y = 200;
    }

    if ( controls.left.isDown ) {
	player.body.velocity.x = -200;
    } else if ( controls.right.isDown ) {
	player.body.velocity.x = 200;
    }
}

function update()
{
    check_input();
    this.physics.arcade.collide(player, layer);
}
