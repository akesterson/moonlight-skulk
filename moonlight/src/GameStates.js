var GameState = function(game) {
}

GameState.prototype.updateClock = function()
{
    this.clock.setSeconds(this.clock.getSeconds() + 1);
    this.clock.setMilliseconds(0);
}

GameState.prototype.create = function()
{
    this.map = this.add.tilemap('map');
    for (var k in moonlightSettings['map']['tilesets']) {
	var ts = moonlightSettings['map']['tilesets'][k];
	this.map.addTilesetImage(ts['name']);
    }
    this.map_collision_layers = [];
    pfgrid = [];

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
		this.aiSprites.debug = false;
		this.aiSpriteEffects = game.add.group();
		this.staticSounds = game.add.group();
		this.bubble_group = game.add.group();
		this.map.createFromObjects('AI', 3544, 'player', 0, true, false, this.aiSprites, AISprite);
		this.aiSprites.forEach(function(spr) {
		    spr.update_new_values();
		}, this)
		player = this.add.sprite((19 * 32), (21 * 32), 'player');
		player.score = 0;
		player.lightmeter = 0;

	    };
	    if ( lp['collides'] == true ) {
		this.map_collision_layers.push(layer);
		for (var i = 0; i < layer.layer.data.length; i++)
		{
		    if ( i >= pfgrid.length )
			pfgrid[i] = [];
		    for (var j = 0; j < layer.layer.data[i].length; j++)
		    {
			if (layer.layer.data[i][j].index > 0) {
			    pfgrid[i][j] = 1;
			} else if ( pfgrid[i][j] != 1 ) {
			    pfgrid[i][j] = 0;
			}
		    }
		}
	    }
	    layer.resizeWorld();
	}
    }

    this.map_collision_layers.forEach(function(layer) {
	layer.layer.data.forEach(function(row) {
	    row.forEach(function(column) {
		setTileProperties(column);
	    }, this);
	}, this);
    }, this);

    pathfinder_grid = new PF.Grid(this.map.width,
				  this.map.height,
				  pfgrid);
    pathfinder = new PF.AStarFinder({allowDiagonal: false});

    this.physics.arcade.enable(player);
    player.body.setSize(16, 16, 8, 16);
    player.body.center = new Phaser.Point(player.body.width / 2, player.body.height + player.body.halfHeight);
    player.body.collideWorldBounds = true;
    //player.body.immovable = true;

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
    controls.run = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    controls.steal = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.effectSprites = game.add.group();
    this.map.createFromObjects('EffectSprites', 5, 'player', 0, true, false, this.effectSprites, EffectSprite);
    this.effectSprites.forEach(function(spr) {
	spr.update_new_values();
    }, this)

    this.shadowTexture = game.add.bitmapData(game.world.width, game.world.height);
    // drop this lower to make the map darker
    this.shadowTextureColor = [20, 20, 20];
    this.shadowSprite = game.add.image(0, 0, this.shadowTexture);

    this.shadowSprite.blendMode = Phaser.blendModes.MULTIPLY;

    this.staticLights = game.add.group();
    this.map.createFromObjects('Lights', 97, 'player', 0, true, false, this.staticLights, Light);
    this.staticLights.forEach(function(light) {
	light.update_new_values();
    }, this)


    this.map.createFromObjects('Sounds', 11, 'player', 0, true, false, this.staticSounds, SoundSprite);
    this.staticSounds.forEach(function(snd) {
	snd.update_new_values();
    }, this)

    this.uigroup = game.add.group();
    this.recentlyStolenGroup = game.add.group();
    this.game.time.advancedTiming = true;

    this.clock = new Date();
    this.clock.setHours(20, 00, 0, 0);
    this.clockTimer = game.time.create(true);
    this.clockTimer.repeat(DAYLIGHT_TIMER_REPEAT,
			   DAYLIGHT_TIMER_REPEATCOUNT,
			   this.updateClock,
			   this);
    this.clockTimer.start();

    game.camera.deadzone.height -= 68;

    var hudoffset = game.camera.height - 68;
    this.hud = this.game.add.image(0, hudoffset, 'hud', 0, this.uigroup);
    this.hud_hourhand = this.game.add.sprite(39,
					     hudoffset + 36,
					     'clock_hourhand',
					     0,
					     this.uigroup);
    this.hud_hourhand.anchor.setTo(0.5, 0.5);
    this.hud_minutehand = this.game.add.sprite(39,
					       hudoffset + 36,
					       'clock_minutehand',
					       0,
					       this.uigroup);
    this.hud_minutehand.anchor.setTo(0.5, 0.5);
    this.hud_clockoverlay = this.game.add.image(39,
						hudoffset + 36,
						'clock_overlay',
						0,
						this.uigroup);
    this.hud_clockoverlay.anchor.setTo(0.5, 0.5);

    // this.clockText = this.game.add.text(
    // 	20, SCREEN_HEIGHT - 40, '', { font : '16px Arial', fill: '#ffffff' }, this.uigroup
    // );

    this.scoreTextBitmap = bitmapText('', FONTSIZE_MEDIUM);
    this.scoreText = this.game.add.image(484,
					 480 - 68 + 31,
					 this.scoreTextBitmap,
					 0,
					 this.uigroup);

    this.lightbar = this.game.add.sprite(256,
    					hudoffset + 7 + 6,
    					'lightbar',
    					0,
    					this.uigroup);
    this.lightbar.anchor.setTo(0, 0.5)
    this.uigroup.setAll('fixedToCamera', true);
}

GameState.prototype.getClockGamma = function() {
    var clockgamma = 60 - this.clock.getMinutes();
    if ( this.clock.getHours() >= 20 ) {
	clockgamma += (23 - this.clock.getHours()) * 60;
    } else {
	clockgamma += this.clock.getHours() * 60;
    }
    clockgamma = parseInt(clockgamma / 6);
    return clockgamma;
}

GameState.prototype.updateShadowTexture = function() {
    var cv = this.shadowTextureColor;
    var uigamma = parseInt(getDOMValue("uiGamma"));
    var clockgamma = this.getClockGamma();
    this.shadowTexture.context.fillStyle = ("rgb(" + (cv[0] + clockgamma + uigamma) +
					    "," + (cv[1] + clockgamma + uigamma) +
					    "," + (cv[2] + clockgamma + uigamma) + ")"
					   );
    this.shadowTexture.context.fillRect(0, 0, game.world.width, game.world.height);

    this.staticLights.forEach(function(light) {
	if ( light.always_render !== true ) {
            var r1 = positiveRectangle(this.game.camera.x,
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

GameState.prototype.check_input = function()
{
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    velocityMod = 0;
    var newstate = 0;

    if ( controls.steal.justReleased() == true ) {
	addState(player, STATE_STEALING);
    } else {
	delState(player, STATE_STEALING);
    }

    if ( controls.up.isDown) {
	if ( controls.run.isDown ) {
	    newstate = (STATE_FACE_UP | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_UP | STATE_MOVING );
	}
    } else if ( controls.down.isDown ) {
	if ( controls.run.isDown ) {
	    newstate = (STATE_FACE_DOWN | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_DOWN | STATE_MOVING );
	}
    } else if ( controls.left.isDown ) {
	if ( controls.run.isDown ) {
	    newstate = (STATE_FACE_LEFT | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_LEFT | STATE_MOVING );
	}
    } else if ( controls.right.isDown ) {
	if ( controls.run.isDown ) {
	    newstate = (STATE_FACE_RIGHT | STATE_MOVING | STATE_RUNNING);
	} else {
	    newstate = (STATE_FACE_RIGHT | STATE_MOVING );
	}
    } else {
	newstate = getFaceState(player);
    }

    setMovingState(player, newstate);
    setSpriteMovement(player);
}

GameState.prototype.update_player_lightmeter = function() {
    var avg_shadow = Number(array_average(this.shadowTextureColor));
    player.lightmeter = ((avg_shadow + this.getClockGamma()) / 255.0);
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
    player.lightmeter += lightValue;
    player.lightmeter = Math.min(player.lightmeter, 1.0);
    this.lightbar.scale.x = player.lightmeter;
    this.lightbar.alpha = 0.5 + (player.lightmeter / 2);
    //this.lightbar_crop.width = ((this.lightbar_image.width) * player.lightmeter);
    //this.lightbar.crop(this.lightbar_crop);
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

    function _player_collide(x) {
	if ( x.collide_with_map == true ) {
	    for ( var ln in this.map_collision_layers ) {
		layer = this.map_collision_layers[ln];
		this.physics.arcade.collide(x, layer);
	    }
	}
	if ( x.collide_with_player == false )
	    return;
	if ( x.canSeeSprite(player, false) == true ) {
	    x.sawPlayer(game, player);
	    if ( player.lightmeter >= x.sprite_can_see_lightmeter ) {
 		x.setAwarenessEffect(STATE_ALERTED);
	    } else {
		x.setAwarenessEffect(STATE_CONCERNED);
	    }
	    return;
	} else {
	    if ( this.physics.arcade.overlap(x, player) ) {
		x.setAwarenessEffect(STATE_CONCERNED);
	    } else if ( hasState(x, STATE_LOSTHIM) == false ) {
		x.setAwarenessEffect(STATE_LOSTHIM);
	    } else {
		x.setAwarenessEffect(STATE_UNAWARE);
	    }
	}
	if ( this.physics.arcade.overlap(x, player) == true ) {
	    x.sawPlayer(game, player);
	    x.setAwarenessEffect(STATE_ALERTED);
	}
	if ( hasState(player, STATE_STEALING) == true &&
	     x.sprite_has_treasure == true ) {
	    var prevpos = player.body.position;
	    var prevwidth = player.body.width;
	    var prevheight = player.body.height;
	    player.body.position = new Phaser.Point();
	    player.body.x = prevpos.x;
	    player.body.y = prevpos.y;
	    switch ( getFaceState(player) ) {
		case STATE_FACE_LEFT: {
		    player.body.x -= (STEAL_DISTANCE + 8);
		    break;
		}
		case STATE_FACE_RIGHT: {
		    player.body.width += (STEAL_DISTANCE + 8);
		    break;
		}
		case STATE_FACE_DOWN: {
		    player.body.height += STEAL_DISTANCE;
		    break;
		}
		case STATE_FACE_UP: {
		    player.body.y -= (STEAL_DISTANCE * 2);
		    break;
		}
	    }
	    if ( this.physics.arcade.overlap(x, player) == true ) {
		delState(player, STATE_STEALING);
		x.sprite_has_treasure = false;
		var stolen = moonlightTreasures[x.sprite_treasure];
		if ( typeof stolen == 'undefined' ) {
		    // You should put a trap here.
		    console.log("Tried to steal undefined : " + x.sprite_treasure);
		} else {
		    player.score += stolen['value'];
		}
		x.sprite_treasure = null;
		if ( this.recentlyStolenGroup.total >= RECENTLYSTOLEN_MAX ) {
		    this.recentlyStolenGroup.remove(
			this.recentlyStolenGroup.getBottom(),
			true);
		}
		this.recentlyStolenGroup.addAll('cameraOffset.x', 36);
		var rs = game.add.sprite(
		    SCREEN_OFFSET_RECENTLYSTOLEN.x + 12,
		    SCREEN_OFFSET_RECENTLYSTOLEN.y + 12,
		    'treasure',
		    (stolen['y'] * TREASURE_SHEET_WIDTH) + stolen['x'],
		    this.recentlyStolenGroup);
		rs.anchor.setTo(0.5, 0.5);
		rs.scale.x = 3;
		rs.scale.y = 3;
		rs.angle = 0;
		tween = game.add.tween(rs);
		tween.to({angle: 360}, 1000, null);
		tween.onComplete.add(function(){this.angle=0;}, rs);
		tween.start();
		tween = game.add.tween(rs.scale);
		tween.to({x: 1, y: 1}, 1000, null);
		tween.start();
		rs.fixedToCamera = true;
	    }
	    player.body.position = prevpos;
	    player.body.width = prevwidth;
	    player.body.height = prevheight;
	}
    }

    // this.effectSprites.forEach(_player_collide, this);

    function _AI_collide(o1, o2)
    {
	o1.collide_with_AI(o2);
    }

    this.aiSprites.forEach(_player_collide, this);
    game.physics.arcade.overlap(this.aiSprites, this.aiSprites,
				_AI_collide);
    this.updateShadowTexture();

    if ( this.aiSprites.debug == true ) {
    	function _draw_viewrect(x) {
    	    var r = x.viewRectangle();
    	    if ( isSet(r) == false )
    		return;
    	    this.shadowTexture.context.fillStyle = 'rgb(128, 128, 255)';
    	    this.shadowTexture.context.fillRect(r.left,
    						r.top,
    						r.width,
    						r.height);
    	}
    	this.aiSprites.forEach(_draw_viewrect, this);
    	function _draw_aipath(x) {
    	    var p = x.path;
    	    if ( isSet(p) == false)
    		return;
    	    this.shadowTexture.context.fillStyle = 'rgb(255, 128, 128)';
    	    p.forEach(function(r) {
    		this.shadowTexture.context.fillRect(r.start.x,
    						    r.start.y,
    						    r.end.x - r.start.x,
    						    r.end.y - r.start.y);
    	    }, this);
    	}
    	this.aiSprites.forEach(_draw_aipath, this);
    }
    var clockhour = this.clock.getHours();
    if ( this.clock.getHours() > 12 )
	clockhour -= 12;
    this.hud_hourhand.frame = parseInt((5 * clockhour) + (0.083 * this.clock.getMinutes()));
    this.hud_minutehand.frame = this.clock.getMinutes();
    this.scoreTextBitmap.setText("$ " + player.score);
}

GameState.prototype.shutdown = function()
{
    this.aiSprites.setAll('ready_to_update', false);
    this.aiSprites.forEach(function(x) {
	if ( isSet(x.awareness_timer) == true )
	    x.awareness_timer.stop();
	if ( isSet(x.glint_timer) == true )
	    x.glint_timer.stop();
	if ( isSet(x.conversation_timer) == true )
	    x.conversation_timer.stop();
	if ( isSet(x.rotation_timer) == true )
	    x.rotation_timer.stop();
	if ( isSet(x.timer) == true )
	    x.timer.stop();
    }, this);
    this.aiSprites.destroy();
    this.aiSprites = null;
    this.aiSpriteEffects.destroy();
    this.aiSpriteEffects = null;
    this.uigroup.destroy();
    this.uigroup = null;
    this.recentlyStolenGroup.destroy();
    this.clock = null;
    this.clockTimer.stop();
    this.bubble_group.destroy();
    this.effectSprites.destroy();
    this.shadowTextureColor = null;
    this.staticSounds.forEach(function(x) {
	x.sound.stop();
	game.sound.remove(x);
    }, this);
    this.map_collision_layers.forEach(function(x) {
	x.destroy();
    }, this);
    this.map.destroy();
    pathfinder_grid = null;
    pathfinder = null;
    this.shadowSprite.destroy();
    this.staticLights.destroy();
    this.staticSounds.destroy();
}

var Boot = function(game) {
}

Boot.prototype.preload = function()
{
    game.load.image('background', 'gfx/ui/background.png');
    game.load.image('font-16px', 'gfx/ui/font-16px.png');
    game.load.image('font-8px', 'gfx/ui/font-8px.png');
    game.load.image('lightbar', 'gfx/ui/lightbar.png');
    game.load.image('loadingtube', 'gfx/ui/loadingtube.png');
    game.load.spritesheet('gears', 'gfx/ui/gears.png', 128, 128, 10);
};

Boot.prototype.create = function()
{
    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = false;
    this.stage.scale.pageAlignHoritzontally = true;
    game.state.start('preloader', true, false);
}

var Preloader = function(game) {
}

Preloader.prototype.preload = function()
{
    this.background = game.add.image(0, 0, 'background');
    this.loadingText = textImage(game.world.centerX,
				 game.world.centerY,
				 "Loading...",
				FONTSIZE_MEDIUM);
    this.loadingText.anchor.setTo(0.5, 0.5);
    this.creditText = textImage(game.world.centerX,
				 480 - 16,
				 "Featuring Art by Peter Hann (www.phann.de)",
				 FONTSIZE_SMALL);
    this.creditText.anchor.setTo(0.5, 0.5);
    this.preloadTube = game.add.image(game.world.centerX, 280, 'loadingtube');
    this.preloadTube.anchor.setTo(0.5, 0.5);
    this.loadingGears = game.add.sprite(game.world.centerX - (193/2) - 72,
					game.world.centerY - 112,
					'gears');
    addAnimation(this.loadingGears, 'spingears');
    this.loadingGears.animations.play('spingears');
    this.lightbar = game.add.image(game.world.centerX - (193/2) + 32,
				   280 - 18,
				   'lightbar');
    game.load.setPreloadSprite(this.lightbar, 0);

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

Preloader.prototype.create = function()
{
    function goalready() {
	this.lightbar.destroy();
	this.background.destroy();
	this.preloadTube.destroy();
	this.loadingText.destroy();
	this.loadingGears.destroy();
	game.state.start('startscreen', true, false);
    }

    var tween = this.add.tween(this.lightbar).to({ alpha: 0 }, 5000, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.preloadTube).to({ alpha: 0 }, 4500, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.loadingText).to({ alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.creditText).to({ alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.loadingGears).to({ alpha: 0 }, 4000, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.background).to({ alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(goalready, this);
}

var StartScreen = function(game) {
}

StartScreen.prototype.create = function()
{
    this.background = game.add.image(0, 0, 'background');
    this.labeltext = bitmapText("(C) 2014 Andrew Kesterson - http://akesterson.itch.io/",
				FONTSIZE_SMALL);
    this.linkButton = game.add.button(game.world.centerX,
				      460,
				      this.labeltext,
				      this.linkClicked,
				      this);
    this.linkButton.anchor.setTo(0.5, 0.5);

    this.startGameButton = game.add.button(game.world.centerX,
    					   100,
    					   'newgamebtn',
    					   this.startGameClicked,
    					   this,
    					   1,
    					   0);
    this.startGameButton.anchor.setTo(0.5, 0.5);
    this.creditsButton = game.add.button(game.world.centerX,
    					 200,
    					 'creditsbtn',
    					 this.creditsClicked,
    					 this,
    					 1,
    					 0);
    this.creditsButton.anchor.setTo(0.5, 0.5);
    this.startGameButton.alpha = 0;
    this.creditsButton.alpha = 0;
    this.linkButton.alpha = 0;

    var tween = this.add.tween(this.startGameButton).to({ alpha: 1.0 }, 3000, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.creditsButton).to({ alpha: 1.0 }, 3000, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.linkButton).to({ alpha: 1.0 }, 3000, Phaser.Easing.Linear.None, true);
    tween = this.add.tween(this.background).to({ alpha: 1.0 }, 3000, Phaser.Easing.Linear.None, true);
}

StartScreen.prototype.linkClicked = function()
{
    window.open("http://akesterson.itch.io/");
}

StartScreen.prototype.startGameClicked = function()
{
    this.startGameButton.destroy();
    this.creditsButton.destroy();
    this.background.destroy();
    this.linkButton.destroy();
    this.labeltext.destroy();
    game.state.start('game', true, false);
}

StartScreen.prototype.creditsClicked = function()
{
    console.log("Roll the credits dumbass");
}

var EndScreen = function(game) {
}

EndScreen.prototype.create = function()
{
    this.gameOverText = game.add.image((640/2),
				       100,
				       'gameover');
    this.gameOverText.anchor.setTo(0.5, 0.5);
    this.startGameButton = game.add.button((640 / 2),
					   200,
					   'newgamebtn',
					   this.startGameClicked,
					   this,
					   1,
					   0);
    this.startGameButton.anchor.setTo(0.5, 0.5);
    this.creditsButton = game.add.button((640 / 2),
					 300,
					 'creditsbtn',
					 this.creditsClicked,
					 this,
					 1,
					 0);
    this.creditsButton.anchor.setTo(0.5, 0.5);
}

EndScreen.prototype.startGameClicked = function()
{
    this.startGameButton.destroy();
    this.creditsButton.destroy();
    this.gameOverText.destroy();
    game.state.start('game', true, false);
}

EndScreen.prototype.creditsClicked = function()
{
    console.log("Roll the credits dumbass");
}
