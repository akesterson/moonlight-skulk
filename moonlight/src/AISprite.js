var AISprite = function(game, x, y, key, frame) {
    this.viewRectangle = function() {
	var offset = [];
	var size = [];
	var multiplier = 1.0;
	if ( hasState(this, STATE_ALERTED) ) {
	    multiplier = 2.0;
	} 

	if ( hasState(this, STATE_FACE_LEFT) ) {
	    offset = [0, -32 * multiplier];
	    size = [-this.view_distance, 96];
	} else if ( hasState(this, STATE_FACE_RIGHT) ) {
	    offset = [32, -32 * multiplier];
	    size = [32 + this.view_distance, 96];
	} else if ( hasState(this, STATE_FACE_DOWN) ) {
	    offset = [-32 * multiplier, 32];
	    size = [96, this.view_distance];
	} else if ( hasState(this, STATE_FACE_UP) ) {
	    offset = [-32 * multiplier, 0];
	    size = [96, -this.view_distance];
	} else {
	    return null;
	}
	size[0] *= multiplier;
	size[1] *= multiplier;
	return positiveRectangle(this.x + offset[0],
				 this.y + offset[1],
				 size[0],
				 size[1]);
    }

    this.canSeeSprite = function(spr, debug) {
	var vd = this.view_distance;
	if ( hasState(this, STATE_FACE_LEFT) ||
	     hasState(this, STATE_FACE_UP) ) {
	    // Without this the player can stand in our view distance
	    // but as long as their left edge is 1 px out we won't see them,
	    // with this we see their near edge
	    vd = vd + 32;
	}
	if ( hasState(this, STATE_ALERTED) )
	    vd = vd * 2;

	var distance = (new Phaser.Line(spr.x, spr.y, this.x, this.y).length);
	if ( distance > vd ) {
	    return false;
	}

	var viewrect = this.viewRectangle();
	if ( viewrect == null ) {
	    return false;
	}
	var sprrect = positiveRectangle(spr.x, spr.y, 32, 32);
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
	this.bubble_sprite = game.add.sprite(this.x, this.y, 'wordbubble');
	this.bubble_sprite.anchor.setTo(0.5, 1.0);
	this.bubble_sprite.scale.x = Number((this.text_size[0] + 16) / bubbleimg.width);
	this.bubble_sprite.scale.y = Number((this.text_size[1] + 16) / bubbleimg.height);
	this.bubble_text = game.add.text(this.x, this.y, text, style);
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
	var ty = this.bubble_sprite.y - (this.bubble_sprite.height) + 8;
	this.bubble_text.position.x = tx;
	this.bubble_text.position.y = ty;
    }

    this.blocked = function() {
	function f() {
	    if ( hasState(this, STATE_FACE_LEFT) &&
		 this.body.blocked.left == true )
		return true;
	    if ( hasState(this, STATE_FACE_RIGHT) &&
		 this.body.blocked.right == true )
		return true;
	    if ( hasState(this, STATE_FACE_DOWN) &&
		 this.body.blocked.down == true )
		return true;
	    if ( hasState(this, STATE_FACE_UP) &&
		 this.body.blocked.up == true )
		return true;
	    return false;
	}
	return f();
    }

    this.path_purge = function() {
	this.path = [];
	this.path_index = 0;
    }

    this.path_set = function(target, force, maxsteps, useNearestWalkable) {
	useNearestWalkable = (typeof useNearestWalkable == 'undefined' ? true : useNearestWalkable);
	maxsteps = (typeof maxsteps == undefined ? maxsteps : this.path_maximum_steps);
	force = ( typeof force == undefined ? false : force );
	if ( force == false &&
	     this.path.length > 0 && 
	     this.path_index < this.path.length ) {
	    return false;
	}
	this.path_purge();
	if ( useNearestWalkable == true ) {
	    var pos = nearestWalkableTile(target);
	} else {
	    var pos = [parseInt(target.x/32), parseInt(target.y/32)];
	}
	tpath = pathfinder.findPath(
	    parseInt(this.x/32), 
	    parseInt(this.y/32),
	    pos[0],
	    pos[1],
	    pathfinder_grid.clone()
	);
	prevpoint = [this.x, this.y];
	console.log("New path has at most " + maxsteps + " steps in it");
	for ( var i = 0 ; i < Math.min(maxsteps, tpath.length) ; i++ ) {
	    if ( (prevpoint[0]+prevpoint[1]) == ((tpath[i][0]*32)+(tpath[i][1]*32)) )
		continue;
	    this.path.push(new Phaser.Line(prevpoint[0], prevpoint[1], 
					   tpath[i][0]*32, tpath[i][1]*32));
	    prevpoint = [tpath[i][0]*32, tpath[i][1]*32];
	}
	return true;
    }

    this.path_tween_start = function(movingstate)
    {
	movingState = (typeof movementState == undefined ? movementState : (STATE_MOVING | STATE_RUNNING));
	this.path_tweens = [];
	prevpos = [this.x, this.y]
	for ( var i = 0; 
	      i < this.path.length ; 
	      i++ ) {
	    pl = this.path[i];
	    movingstate = STATE_MOVING | STATE_RUNNING;
	    if ( pl.end.x < prevpos[0]) {
		movingstate = movingstate | STATE_FACE_LEFT;
	    } else if ( pl.end.x > prevpos[0] ) {
		movingstate = movingstate | STATE_FACE_RIGHT;
	    }
	    if ( pl.end.y < prevpos[1] ) {
		movingstate = movingstate | STATE_FACE_UP;
	    } else if ( pl.end.y > prevpos[1] ) {
		movingstate = movingstate | STATE_FACE_DOWN;
	    }
	    prevpos = [pl.end.x, pl.end.y];
	    tween = game.add.tween(this);
	    tween.movingstate = movingstate;
	    this.path_tweens.push(tween);
	    tween.to(
		{x: (pl.end.x), y: (pl.end.y)},
		(TWEEN_DURATION_PERPIXEL_RUNNING * pl.length),
		null);
	    tween.onStart.add(function() {
		setMovingState(this._object, this.movingstate);
		this._object.animations.play("bipedrun" + spriteFacing(this._object));
	    }, tween);
	    tween.onComplete.add(function() {
		this._object.path_index += 1;
		setMovingState(this._object, getFaceState(this._object));
		this._object.animations.play("bipedrun" + spriteFacing(this._object));		
		this._object.animations.stop();
	    }, tween);
	    if ( i > 0 ) {
		this.path_tweens[i-1].onComplete.add(tween.start, 
						     tween);
	    }
	}
	if ( this.path_tweens.length > 0 )
	    this.path_tweens[0].start();
    }

    this.path_tween_stop = function()
    {
	this.path_tweens.forEach(function(x) {
	    x.stop();
	    game.tweens.remove(x);
	}, this);
    }

    this.turnUnseenDirection = function() {
	if ( this.seen_directions.length >= 4 )
	    this.seen_directions = [];
	var directions = [STATE_FACE_DOWN, STATE_FACE_LEFT,
			  STATE_FACE_RIGHT, STATE_FACE_UP];
	var newdirection = directions[game.rnd.integerInRange(0, 3)];
	while ( this.seen_directions.indexOf(newdirection) !== -1 ) {
	    newdirection = directions[game.rnd.integerInRange(0, 3)];
	}
	setMovingState(this, newdirection);
	this.animations.stop();
	this.animations.play("bipedrun" + spriteFacing(this));		
	this.animations.stop();
	if ( this.rotation_timer !== null ) {
	    this.rotation_timer.stop();
	    this.rotation_timer = null;
	}
    }

    this.chasetarget = function(target, alertedState, movingstate, visual, maxsteps)
    {
	alertedState = (typeof alertedState == undefined ? STATE_ALERTED : alertedState);
	visual = (typeof visual == undefined ? false : visual);
	movingstate = (typeof alertedState == undefined ? STATE_NONE : movingstate);
	if ( game.physics.arcade.collide(this, target) )
	    return;

	if ( this.path_index >= this.path.length ) {
	    this.path_tween_stop();
	    if ( (visual == false) || (this.canSeeSprite(target, false) == true )) {
		this.setAwarenessEffect(alertedState);
		this.path_set(target, true, maxsteps);
		this.path_tween_start(movingstate);
	    } else {
		if ( this.rotation_timer == null ) {
		    this.rotation_timer = game.time.create(false);
		    timerev = this.rotation_timer.add(250, this.turnUnseenDirection, this);
		    this.rotation_timer.start()
		}
	    }
	} else {
	    if ( this.path_set(target, this.blocked(true), maxsteps) == true ) {
		if ( (visual == false) || (this.canSeeSprite(target, false) == false )) {
		    this.path_purge();
		    this.path_tween_stop();
		} else {
		    this.setAwarenessEffect(alertedState);
		    this.path_tween_start(movingstate);
		}
	    }
	}
    }

    this.action_chaseplayer = function()
    {
	this.chasetarget(player, 
			 STATE_ALERTED, 
			 STATE_MOVING | STATE_RUNNING,
			 true);
	return;
    }

    this.action_reportplayer = function()
    {
	if ( (this.path.length < 1) || this.path_index >= this.path.length) {
	    if ( hasState(this, STATE_RUNNINGTOLIGHT) == false ) {
		var aiSprites = game.state.states.game.aiSprites;
		this.target = nearestInGroup(this, aiSprites, "townsfolk-guard");
	    }
	}
	if ( this.target !== null &&
	     hasState(this, STATE_RUNNINGTOLIGHT) == false ) {
	    if ( (game.physics.arcade.collide(this, this.target) == true) ) {
		this.path_tween_stop();
		this.path_purge();
		var staticLights = game.state.states.game.staticLights;		
		this.target = nearestInGroup(this, staticLights);
		console.log("Running to the nearest light");
		console.log(this.target);
		addState(this, STATE_RUNNINGTOLIGHT);
	    }   
	    this.chasetarget(this.target,
			     STATE_ALERTED, 
			     STATE_MOVING | STATE_RUNNING,
			     false,
			     1000);
	}
    }

    this.action_huntplayer = function()
    {
	console.log("I AM HUNTING FOR THE PLAYER");
	setSpriteMovement(this);
    }

    this.action_wander = function()
    {
	var newstate = STATE_NONE;
	if ( this.sprite_canmove == false) {
	    return;
	}
	if ( game.rnd.integerInRange(0, 100) < 95 )
	    return;
	this.turnUnseenDirection();
	addState(this, STATE_MOVING);
	setSpriteMovement(this);
    }

    this.update = function()
    {
	if ( this.ready_to_update == false )
	    return;
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

	if ( hasState(this, STATE_ALERTED) ) {
	    if ( this.sprite_group == "townsfolk-guard" ) {
		this.action_chaseplayer();
	    } else {
		this.action_reportplayer();
	    }
	} else if ( hasAnyState(this, [STATE_CONCERNED, STATE_LOSTHIM]) ) {
	    this.action_huntplayer();
	} else {
	    this.action_wander();
	}
    }

    this.update_new_values = function() {
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

	this.path_maximum_steps = parseInt(this.path_maximum_steps);
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
	this.ready_to_update = true;
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
    
    this.ready_to_update = false;
    Phaser.Sprite.call(this, game, x, y, null);
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    pathfinder_grid = [];
    this.walkables = [];
    this.path = [];
    this.target = null;
    this.path_tweens = [];
    this.path_maximum_steps = 4;
    this.awareness_change_enabled = true;
    this.lightmeter = 1.0;
    this.sprite_can_see_lightmeter = 0.3;
    this.awareness_effect = null;
    this.awareness_timer = null;
    this.lastSawPlayerAt = null;
    this.seen_directions = [];
    this.sprite_awareness_duration = 60000;
    this.sprite_canmove = 'true';
    this.collide_with_player = 'true';
    this.collide_with_map = 'true';
    this.carries_light = 'false';
    this.view_distance = 32 * 5;
    this.timer = null;
    this.rotation_timer = null;
    this.origin = new Phaser.Point(x, y);
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
