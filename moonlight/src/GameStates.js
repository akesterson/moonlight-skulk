var GameState = function(game) {
}

GameState.prototype.updateClock = function()
{
    this.clock.setSeconds(this.clock.getSeconds() + 1);
    if ( this.clock.getSeconds() == 59)
	player.score += SCORE_PERSECOND;
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
		this.aiSprites.debug = true;
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

    this.aiSpriteEffects = game.add.group();
			     
    this.staticSounds = game.add.group();
    this.map.createFromObjects('Sounds', 11, 'player', 0, true, false, this.staticSounds, SoundSprite);
    this.staticSounds.forEach(function(snd) {
	snd.update_new_values();
    }, this)

    this.bubble_group = game.add.group();

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

    this.scoreText = this.game.add.text(
        SCREEN_WIDTH - 80, SCREEN_HEIGHT - 30, '', 
	{ font: '16px Arial', fill: '#ffffff' }, this.uigroup
    );

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
    this.lightbar.scale.y = player.lightmeter;
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

    if ( this.aiSprites.debug == false ) {
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
    // this.clockText.setText("" + this.clock.getHours() + ":" + this.clock.getMinutes() + ":" + this.clock.getSeconds());
    this.scoreText.setText("" + player.score);
}

function Boot()
{
    Phaser.State.call(game, this);
}

var Boot = function(game) {
}

Boot.prototype.preload = function()
{
    game.load.image('preloader', 'gfx/ui/preloader.png');
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
    this.preloadBar = game.add.sprite(0, 0, 'preloader');
    this.preloadBar.anchor.setTo(0.5, 0.5);
    this.preloadBar.x = game.camera.x + (game.camera.width / 2);
    this.preloadBar.y = game.camera.y + (game.camera.width / 2);
    game.load.setPreloadSprite(this.preloadBar, 0);

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
	this.preloadBar.destroy();
	game.state.start('game', true, false);
    }

    var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(goalready, this);
}


