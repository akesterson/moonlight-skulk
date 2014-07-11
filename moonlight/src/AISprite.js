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

	var viewline = new Phaser.Line(this.x, this.y, spr.x, spr.y);
	if ( viewline.length > vd ) {
	    return false;
	}

	var viewrect = this.viewRectangle();
	if ( isSet(viewrect) == false ) {
	    return false;
	}
	var sprrect = positiveRectangle(spr.x, spr.y, 32, 32);
	if ( viewrect.intersects(sprrect) || viewrect.containsRect(sprrect) ) {
	    var grid = gridWithAISprites();
	    viewline = new Phaser.Line(viewline.start.x / 32,
				       viewline.start.y / 32,
				       viewline.end.x / 32,
				       viewline.end.y / 32);
	    var viewcoords = viewline.coordinatesOnLine(1);
	    // Start the counter at 1 so we skip our own tile
	    for ( var ctr = 1; ctr < viewcoords.length ; ctr++ ) {
		var coord = [parseInt(viewcoords[ctr][0]),
			     parseInt(viewcoords[ctr][1])];
		if ( grid.nodes[coord[1]][coord[0]].walkable == false )
		    return false;
	    }
	    return true;
	}

	return false;
    }

    this.enableAwarenessChange = function(state) {
	this.awareness_change_enabled = true;
    }

    this.enableConversation = function(state) {
	delState(this, STATE_CONVERSATION_DISABLED);
    }

    this.startConversationTimer = function() {
	addState(this, STATE_CONVERSATION_DISABLED);
	if ( isSet(this.conversation_timer) )
	    this.conversation_timer.stop();
	this.conversation_timer = game.time.create(false);
	this.conversation_timer.add(30000, 
				 this.enableConversation, 
				 this);
	this.conversation_timer.start()
    }

    this.enableCollision = function()
    {
	delState(this, STATE_COLLISION_DISABLED);
    }

    this.startCollisionTimer = function(duration)
    {
	duration = (typeof duration == 'undefined' ? 5000 : duration);
	addState(this, STATE_COLLISION_DISABLED);
	if ( isSet(this.collision_timer) )
	    this.collision_timer.stop();
	this.collision_timer = game.time.create(false);
	this.collision_timer.add(duration, 
				 this.enableCollision, 
				 this);
	this.collision_timer.start()
    }

    this.startAwarenessTimer = function() {
	this.awareness_change_enabled = false;
	if ( isSet(this.awareness_timer) )
	    this.awareness_timer.stop();
	this.awareness_timer = game.time.create(false);
	this.awareness_timer.add(this.sprite_awareness_duration, 
				 this.enableAwarenessChange, 
				 this);
	this.awareness_timer.start()
    }

    this.runGlintEffect = function() {
	if ( this.sprite_has_treasure == true ) {
	    if ( isSet(this.glint_effect) == true )
		this.glint_effect.destroy();
	    this.glint_effect = game.state.states.game.add.sprite(
		this.x + 16,
		this.y + 24,
		'glint',
		0,
		game.state.states.game.aiSpriteEffects
	    );
	    addAnimation(this.glint_effect, 'glint');
	    this.glint_effect.anchor.setTo(0.5, 0.5);
	    this.glint_effect.play('glint', null, false, true);
	    this.glint_timer = game.time.create(false);
	    this.glint_timer.add(game.rnd.integerInRange(5000, 10000), 
				 this.runGlintEffect, 
				 this);
	    tween = game.add.tween(this.glint_effect);
	    tween.to({angle: 180}, 1000, null);
	    tween.start();
	    this.glint_timer.start();
	}
    }

    this.setAwarenessEffect = function(state, force) {
	var animkey = "";
	force = (typeof force == 'undefined' ? false : force);

	if ( state == STATE_NONE )
	    return;

	if ( hasState(this, state) == true ) {
	    // restart the awareness timer
	    this.startAwarenessTimer();
	    return;
	} else if ( (state == STATE_LOSTHIM) && 
		    (hasState(this, STATE_ALERTED) == false) &&
		    (hasState(this, STATE_CONCERNED) == false)) {
	    return;
	} 

	if ( this.awareness_change_enabled == false &&
	     state != STATE_ALERTED ) {
	    return;
	}
	if ( state == STATE_ALERTED &&
	     isSet(this.target) == true &&
	     this.target != player )
	    this.target = null;

	if ( hasState(this, STATE_CONVERSING) == true &&
	     ( state == STATE_CONCERNED ||
	       state == STATE_ALERTED ) ) {
	    purgeConversation(this, this.conversation_partner);
	}

	awardPlayerScoreByState(state);
	this.state_changed_at = new Phaser.Point(this.x, this.y);
	this.startAwarenessTimer();
	setAwarenessState(this, state);

	if ( isSet(this.awareness_effect) ) {
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
	if ( isSet(this.awareness_effect) == true )
	    this.awareness_effect.destroy();
	this.awareness_effect = game.state.states.game.add.sprite(
	    this.x + 16,
	    this.y - 16,
	    'balloon');
	addAnimation(this.awareness_effect, animkey);
	this.awareness_effect.play(animkey, null, false, true);
    }

    this.enableWordBubble = function() {
	this.enable_word_bubble = true;
	if ( this.bubble_immediate == true ) {
	    this.bubble_immediate = false;
	    this.setWordBubble();
	} else {
	    if ( isSet(this.conversation_partner) == true &&
	         hasState(this, STATE_CONVERSING_YOURTURN) == true) {
		this.setWordBubble();
	    } else {
		var timerdelta = 10000 + (game.rnd.integerInRange(0, 20) * 1000);
		this.timer = game.time.create(false);
		timerev = this.timer.add(timerdelta, this.setWordBubble, this);
		this.timer.start()
	    }
	}
    }

    this.clearWordBubble = function(autoadvance) {
	autoadvance = (typeof autoadvance == 'undefined' ? true : autoadvance);
	if ( isSet(this.bubble_text) ) {
		this.bubble_text.destroy();
		this.bubble_sprite.destroy();
		this.bubble_text = null;
		this.bubble_sprite = null;
	} 
	if ( isSet(this.conversation_partner) == true &&
	     hasState(this, STATE_CONVERSING_YOURTURN) == true ) {
	    delState(this, STATE_CONVERSING_YOURTURN);
	    addState(this.conversation_partner, STATE_CONVERSING_YOURTURN);
	    this.enable_word_bubble = false;
	    if ( autoadvance == true )
		this.conversation_partner.enableWordBubble();
	    return;
	}
	this.enable_word_bubble = false;
	this.timer = game.time.create(false);
	timerev = this.timer.add(1000, this.enableWordBubble, this);
	this.timer.start()
    }

    this.setWordBubble = function()
    {
	if ( isSet(this.bubble_text) == true || 
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

	if ( isSet(this.conversation_partner) == true ) {
	    if ( hasState(this, STATE_CONVERSING_YOURTURN) == false )
		return;
	    if ( this.conversation_index >= this.current_conversation['lines'].length ) {
		purgeConversation(this, this.conversation_partner);
		return;
	    }
	    var text = this.current_conversation['lines'][this.conversation_index];
	    this.conversation_index += 2;
	} else {
	    var mylines = moonlightDialog['status'][this.sprite_group][aistate];
	    var text = mylines[game.rnd.integerInRange(0, mylines.length-1)];
	}
	bubbleimg = game.cache.getImage('wordbubble');
	style = {font: '14px Arial Bold', fill: '#ffffff'}
	this.text_size = stringSize(text, style['font']);
	if ( isSet(this.bubble_sprite) == true )
	    this.bubble_sprite.destroy();
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
	maxsteps = (typeof maxsteps == 'undefined' ? this.path_maximum_steps : maxsteps);
	force = ( typeof force == 'undefined' ? false : force );
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
	    gridWithAISprites()
	);
	prevpoint = [this.x, this.y];
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
	var movingstate = (typeof movingstate == 'undefined' ? (STATE_MOVING | STATE_RUNNING) : movingstate);
	this.path_tweens = [];
	prevpos = [this.x, this.y]
	for ( var i = 0; 
	      i < this.path.length ; 
	      i++ ) {
	    pl = this.path[i];
	    var stepstate = movingstate;
	    if ( pl.end.x < prevpos[0]) {
		stepstate = stepstate | STATE_FACE_LEFT;
	    } else if ( pl.end.x > prevpos[0] ) {
		stepstate = stepstate | STATE_FACE_RIGHT;
	    }
	    if ( pl.end.y < prevpos[1] ) {
		stepstate = stepstate | STATE_FACE_UP;
	    } else if ( pl.end.y > prevpos[1] ) {
		stepstate = stepstate | STATE_FACE_DOWN;
	    }
	    prevpos = [pl.end.x, pl.end.y];
	    tween = game.add.tween(this);
	    tween.stepstate = stepstate;
	    this.path_tweens.push(tween);
	    var tweenspeed = TWEEN_DURATION_PERPIXEL_WALKING;
	    if ( (stepstate & STATE_RUNNING) == STATE_RUNNING ) 
		tweenspeed = TWEEN_DURATION_PERPIXEL_RUNNING;
	    tween.to(
		{x: (pl.end.x), y: (pl.end.y)},
		(tweenspeed * pl.length),
		null);
	    tween.onStart.add(function() {
		setMovingState(this._object, this.stepstate);
		this._object.animations.play(getMovingAnimationName(this._object));
	    }, tween);
	    tween.onComplete.add(function() {
		this._object.path_index += 1;
		setMovingState(this._object, getFaceState(this._object));
		this._object.animations.play(getMovingAnimationName(this._object));		
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
	}, this);
	this.path_tweens = [];
    }

    this.turnRandomDirection = function() {
	var directions = [STATE_FACE_DOWN, STATE_FACE_LEFT,
			  STATE_FACE_RIGHT, STATE_FACE_UP];
	setMovingState(this, directions[game.rnd.integerInRange(0, 3)]);
	this.animations.stop();
	this.animations.play(getMovingAnimationName(this));		
	this.animations.stop();
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
	this.seen_directions.push(newdirection);
	setMovingState(this, newdirection);
	this.animations.stop();
	this.animations.play(getMovingAnimationName(this));		
	this.animations.stop();
	if ( isSet(this.rotation_timer) ) {
	    this.rotation_timer.stop();
	    this.rotation_timer = null;
	}
    }

    this.chasetarget = function(target, alertedState, movingstate, visual, maxsteps, useNearestWalkable)
    {
	alertedState = (typeof alertedState == 'undefined' ? STATE_ALERTED : alertedState);
	visual = (typeof visual == 'undefined' ? false : visual);
	movingstate = (typeof alertedState == 'undefined' ? STATE_NONE : movingstate);
	if ( game.physics.arcade.collide(this, target) )
	    return;

	if ( this.path_index >= this.path.length ) {
	    this.path_tween_stop();
	    if ( ((visual == true) && (this.canSeeSprite(target, false) == true )) ||
		 (visual == false)) {
		
		this.setAwarenessEffect(alertedState);
		this.path_set(target, true, maxsteps, useNearestWalkable);
		this.path_tween_start(movingstate);
	    } else {
		if ( ( hasState(this, STATE_ALERTED) == true ) && 
		     ( this.seen_directions.length < 4 ) ) {
		    this.startTimedRotation();
		} else if ( hasState(this, STATE_ALERTED) == true ) {
		    this.action_huntplayer();
		}
	    }
	} else {
	    if ( this.path_set(target, this.blocked(true), maxsteps, useNearestWalkable) == true ) {
		if ( (visual == true) && (this.canSeeSprite(target, false) == false )) {
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
	if ( this.path.length > 0 && 
	     this.path_index >= this.path.length &&
	     hasState(this, STATE_RUNNINGTOREPORT) ) {
	    delState(this, STATE_RUNNINGTOREPORT);
	    this.target = player;
	}
	if ( hasState(this, STATE_RUNNINGTOREPORT) ) {
	    this.chasetarget(this.lastSawPlayerAt, 
			     STATE_ALERTED, 
			     STATE_MOVING | STATE_RUNNING,
			     false,
			     1000,
			     true);
	} else { 
	    this.chasetarget(player,
			     STATE_ALERTED, 
			     STATE_MOVING | STATE_RUNNING,
			     true,
			     undefined,
			     false);
	}
	return;
    }

    this.action_reportplayer = function()
    {
	if ( (this.path.length < 1) || this.path_index >= this.path.length) {
	    if ( isSet(this.target) == false && 
		 hasState(this, STATE_RUNNINGTOLIGHT) == false ) {
		var aiSprites = game.state.states.game.aiSprites;
		this.target = nearestInGroup(this, aiSprites, "townsfolk-guard");
	    } else if ( hasState(this, STATE_RUNNINGTOLIGHT) == false ) {
		if ( isSet(this.target) ) {
		    if ( isSet(this.target.rotation_timer) ) {
			this.target.rotation_timer.stop();
			this.target.rotation_timer = null;
		    }
		    if ( isSet(this.target.sprite_group) ) {
			this.target.path_purge();
			this.target.setAwarenessEffect(STATE_ALERTED);
			this.target.target = this.lastSawPlayerAt;
			this.target.lastSawPlayerAt = this.lastSawPlayerAt;
			addState(this.target, STATE_RUNNINGTOREPORT);
		    }
		}
		this.path_tween_stop();
		this.path_purge();
		var staticLights = game.state.states.game.staticLights;		
		this.target = nearestInGroup(this, staticLights);
		addState(this, STATE_RUNNINGTOLIGHT);		
	    } else {
		this.awareness_timer.stop();
		this.awareness_change_enabled = true;
		this.setAwarenessEffect(STATE_CONCERNED);
		setMovingState(this, STATE_NONE);
		this.turnRandomDirection();
		this.target = null;
		this.path_purge();
		delState(this, STATE_RUNNINGTOLIGHT);
		return;
	    }
	}
	if ( isSet(this.target) ) {
	    this.chasetarget(this.target,
			     STATE_ALERTED, 
			     STATE_MOVING | STATE_RUNNING,
			     false,
			     1000);
	}
    }

    this.random_huntable_target = function(hunt_radius) {
	hunt_radius = (typeof hunt_radius == 'undefined' ? this.hunt_radius : hunt_radius);
	var curmap = game.state.states.game.map;
	var intgridx = parseInt(this.state_changed_at.x/32);
	var intgridy = parseInt(this.state_changed_at.y/32);
	var boundleft = Math.max(0, (intgridx - hunt_radius));
	var boundtop = Math.max(0, (intgridy - hunt_radius));
	var boundright = Math.min(curmap.width, (intgridx + hunt_radius));
	var boundbottom = Math.min(curmap.height, (intgridy + hunt_radius));
	var destx = game.rnd.integerInRange(boundleft, boundright);
	var desty = game.rnd.integerInRange(boundtop, boundbottom);
	return new Phaser.Sprite(game, destx*32, desty*32, null);
    }

    this.stopTimedRotation = function() {
	if ( isSet(this.rotation_timer) == true ) {
	    this.rotation_timer.stop();
	    this.rotation_timer = null;
	}
	this.seen_directions = [];
    }

    this.startTimedRotation = function() {
	var rotation_times = {};
	rotation_times["" + STATE_UNAWARE] = 5000;
	rotation_times["" + STATE_CONCERNED] = 1000;
	rotation_times["" + STATE_ALERTED] = 250;
	rotation_times["" + STATE_LOSTHIM] = 1000;
	if ( isSet(this.rotation_timer) == false ) {
	    this.rotation_timer = game.time.create(false);
	    timerev = this.rotation_timer.add(
		rotation_times["" + getAwarenessState(this)], 
		this.turnUnseenDirection, 
		this);
	    this.rotation_timer.start()
	}
    }

    this.action_huntplayer = function()
    {
	if ( hasState(this, STATE_LOOKINGFORTARGET) == false && 
	     this.path.length < 1 ) {
	    this.target = this.random_huntable_target() 
	} else if ( hasState(this, STATE_LOOKINGFORTARGET) ) {
	    if ( this.seen_directions.length < 4 ) {
		this.startTimedRotation();
	    } else {
		this.seen_directions = [];
		delState(this, STATE_LOOKINGFORTARGET);
		this.target = this.random_huntable_target() 
	    }
	} else if ( this.path.length > 0 && 
		    this.path_index >= this.path.length ) {
	    this.path_tween_stop();
	    setMovingState(this, getFaceState(this));
	    setSpriteMovement(this);
	    this.target = null;
	    addState(this, STATE_LOOKINGFORTARGET);
	} 
	if ( isSet(this.target) ) {
	    this.chasetarget(this.target,
			     STATE_NONE,
			     STATE_MOVING,
			     false
			    );
	}
    }

    this.action_wander = function()
    {
	if ( this.sprite_canmove == false) {
	    if ( this.x !== this.origin.x ||
		 this.y !== this.origin.y ) {
		this.chasetarget(this.origin,
				 STATE_NONE,
				 STATE_MOVING,
				 false);
	    } else {
		setMovingState(this, faceStateFromString(this.sprite_facing));
		this.animations.stop();
		this.animations.play(getMovingAnimationName(this));
		this.animations.stop();
	    }
	    return;
	}
	if ( isSet(this.sprite_route) == true ) {
	    if ( this.path.length > 0 && 
		 this.path_index >= this.path.length && 
		 isSet(this.target) &&
		 this.x == this.target.x &&
		 this.y == this.target.y ) {
		this.sprite_route_index += 1;
		this.path_purge();
	    }
	    if ( this.sprite_route_index >= this.sprite_route.polyline.length )
		this.sprite_route_index = 0;
	    var dpoint = this.sprite_route.polyline[this.sprite_route_index];
	    if ( isSet(this.target) == false )  {
		this.target = new Phaser.Sprite(null, 
						this.sprite_route.x + dpoint[0],
						this.sprite_route.y + dpoint[1]);
	    } else {
		if ( isSet(this.target.sprite_group) == true ) {
		    this.target = new Phaser.Sprite(null, 
						    this.sprite_route.x + dpoint[0],
						    this.sprite_route.y + dpoint[1]);
		} else {
		    this.target.x = this.sprite_route.x + dpoint[0];
		    this.target.y = this.sprite_route.y + dpoint[1];
		}
	    }
	    this.chasetarget(this.target,
			     STATE_NONE,
			     STATE_MOVING,
			     false);	    
	}

	// if ( game.rnd.integerInRange(0, 100) < 95 )
	//     return;
	// this.turnUnseenDirection();
	// addState(this, STATE_MOVING);
	// setSpriteMovement(this);
    }

    this.collide_with_AI = function(spr)
    {
	if ( spr == this || hasState(this, STATE_COLLISION_DISABLED) == true )
	    return;

	this.path_tween_stop();
	this.path_purge();
	spr.path_tween_stop();
	spr.path_purge();
	this.animations.stop();
	spr.animations.stop();

	if ( hasState(this, STATE_CONVERSATION_DISABLED) == false &&
	     hasState(this, STATE_CONVERSATION_DISABLED) == false &&
	     spr.conversation_partner == null &&
	     getAwarenessState(spr) == STATE_UNAWARE && 
	     getAwarenessState(this) == STATE_UNAWARE &&
	     game.rnd.integerInRange(0, 100) >= 50 ) {
	    setMovingState(this, getFaceState(this));
	    addState(this, STATE_CONVERSING);
	    setConversation(spr, this);
	    spr.path_tween_stop();
	    spr.path_purge();
	    addState(spr, STATE_CONVERSING);
	    setMovingState(spr, getFaceState(spr));
	} else {
	    this.startCollisionTimer();
	    spr.startCollisionTimer();
	}
    }

    this.update = function()
    {
	if ( this.ready_to_update == false )
	    return;
	// if ( hasState(this, STATE_CONVERSING) == true && game.tweens.isTweening(this) )
	//     throw "WHY THE FUCK AM I STILL TWEENING";

	if ( isSet(this.awareness_effect) ) {
	    if ( this.awareness_effect.alive == false ) {
		this.awareness_effect.destroy();
		this.awareness_effect = null;
	    } else {
		this.awareness_effect.x = this.x + 16;
		this.awareness_effect.y = this.y - 16;
	    }
	}
	if ( isSet(this.glint_effect) ) {
	    if ( this.glint_effect.alive == true ) {
		this.glint_effect.x = this.x + 16;
		this.glint_effect.y = this.y + 24;
	    }
	}
	
	if ( isSet(this.bubble_text) ) {
	    if ( isSet(this.bubble_sprite) == true ) {
		this.snap_bubble_position();
	    }
	}

	if ( hasState(this, STATE_CONVERSING) && 
	     hasState(this, STATE_UNAWARE) ) {
	    return;
	}

	if ( hasState(this, STATE_ALERTED) ) {
	    if ( this.sprite_group == "townsfolk-guard" ) {
		this.action_chaseplayer();
	    } else {
		this.action_reportplayer();
	    }
	} else if ( hasState(this, [STATE_CONCERNED]) ) {
	    this.action_huntplayer();
	} else {
	    this.action_wander();
	}
    }
    
    this.update_new_values = function() {
	if ( isSet(this.timer) )
	    this.timer.stop();
	this.animations.destroy();
	this.clearWordBubble();	
	this.origin.x = this.position.x;
	this.origin.y = this.position.y;
	this.state = STATE_UNAWARE;
	this.view_distance = parseInt(this.view_distance);
	this.state_changed_at = new Phaser.Point(this.x, this.y);
	this.hunt_radius = parseInt(this.hunt_radius);
	this.sprite_can_see_lightmeter = Number(this.sprite_can_see_lightmeter);
	this.sprite_canmove = parseBoolean(this.sprite_canmove);
	this.sprite_awareness_duration = parseInt(this.sprite_awareness_duration);
	this.collide_with_player = parseBoolean(this.collide_with_player);
	this.collide_with_map = parseBoolean(this.collide_with_map);
	this.carries_light = parseBoolean(this.carries_light);
	this.sprite_has_treasure = parseBoolean(this.sprite_has_treasure);
	if ( this.sprite_has_treasure ) {
	    this.sprite_treasure = getRandomTreasure();
	}
	this.path_maximum_steps = parseInt(this.path_maximum_steps);
	if ( isSet(this.sprite_route) == true )
	    this.sprite_route = getRouteByName(this.sprite_route);
	this.loadTexture(this.sprite_name, 0);
	addAnimation(this, 'bipedwalkleft');
	addAnimation(this, 'bipedwalkright');
	addAnimation(this, 'bipedwalkup');
	addAnimation(this, 'bipedwalkdown');
	addAnimation(this, 'bipedrunleft');
	addAnimation(this, 'bipedrunright');
	addAnimation(this, 'bipedrunup');
	addAnimation(this, 'bipedrundown');
	setMovingState(this, faceStateFromString(this.sprite_facing));
	setSpriteMovement(this);
	this.ready_to_update = true;
	this.runGlintEffect();
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
    this.sprite_facing = "down";
    this.walkables = [];
    this.path = [];
    this.state_changed_at = new Phaser.Point(this.x, this.y);
    this.target = null;
    this.hunt_radius = 5;
    this.path_tweens = [];
    this.path_maximum_steps = 4;
    this.awareness_change_enabled = true;
    this.lightmeter = 1.0;
    this.sprite_can_see_lightmeter = 0.3;
    this.awareness_effect = null;
    this.awareness_timer = null;
    this.conversation_timer = null;
    this.glint_effect = null;
    this.glint_timer = null;
    this.lastSawPlayerAt = null;
    this.seen_directions = [];
    this.sprite_awareness_duration = 30000;
    this.sprite_canmove = 'true';
    this.collide_with_player = 'true';
    this.collide_with_map = 'true';
    this.carries_light = 'false';
    this.view_distance = 32 * 5;
    this.timer = null;
    this.rotation_timer = null;
    this.origin = new Phaser.Point(this.x, this.y);
    this.sprite_has_treasure = [true, false][game.rnd.integerInRange(0, 1)];
    this.bubble_immediate = false;
    this.bubble_text = null;
    this.enable_word_bubble = false;
    this.body.collideWorldBounds = true;
    this.sprite_name = "townsfolk-male-1";
    this.sprite_group = "townsfolk-male";
    this.sprite_route = null;
    this.sprite_route_index = 0;
    this.current_conversation = null;
    this.conversation_partner = null;
    this.conversation_index = 0;
    this.update_new_values();
}

AISprite.prototype = Object.create(Phaser.Sprite.prototype);
AISprite.prototype.constructor = AISprite;
