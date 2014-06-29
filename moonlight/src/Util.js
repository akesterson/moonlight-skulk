// Return new array with duplicate values removed
function array_unique(arr) {
    var a = [];
    var l = arr.length;
    for(var i=0; i<l; i++) {
	for(var j=i+1; j<l; j++) {
	    // If arr[i] is found later in the array
	    if (arr[i] === arr[j])
		j = ++i;
	}
	a.push(arr[i]);
    }
    return a;
}

function array_average(arr) {
    return arr.reduce(function (a,b) { 
	return (a + b);
    }) / arr.length;
}


function stringSize(str, font)
{
    var width = 0;
    var height = 0;
    var f = font || '12px arial';
    str.split("\n").forEach(function(x) {
	var o = $('<div>' + x + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'visibility': 'hidden', 'font': f})
            .appendTo($('body'));
	if ( o.width() > width )
	    width = o.width();
	height += 5 + o.height();
	o.remove();
    }, this);
    return [width, height];
}

function rotatePoints(arr, x, y, degrees)
{
    arr.forEach(function(p) {
	p.rotate(x, y, degrees, true);
    }, this);
}

function positiveRectangle(x, y, w, h) {
    if ( w < 0 ) {
	w = -(w);
	x = x - w;
    }
    if ( h < 0 ) {
	h = -(h);
	y = y - h;
    }
    return new Phaser.Rectangle(x, y, w, h);
}

function nearestInGroup(sprite, group, sprite_group) {
    var nearest = null;
    var lastdist = 0.0;
    for ( var i = 0 ; i < group.length; i++ ) {
	console.log("Checking distance to group[" + i + "]");
	var spr = group.getChildAt(i);
	console.log(spr);
	if ( (typeof sprite_group !== undefined) &&
	     spr.sprite_group !== sprite_group ) 
	    continue;
	var dist = new Phaser.Line(sprite.x, sprite.y, spr.x, spr.y);
	if ( (lastdist == 0.0 ) || (dist.length < lastdist) ) {
	    lastdist = dist.length;
	    nearest = spr;
	}
    }
    return nearest;
}

function nearestWalkableTile(spr)
{
    var grid = gridWithAISprites();
    var sprgridx = parseInt(spr.x / 32);
    var sprgridy = parseInt(spr.y / 32);

    // Snap sprites outside the grid to the grid edge
    if ( sprgridy > grid.nodes.length ) {
	sprgridy = grid.nodes.length - 1;
    }
    if ( sprgridx > grid.nodes[sprgridy].length ) {
	sprgridx = grid.nodes[sprgridy].length - 1;
    }

    function _walkable_inner(multiplier) {
	var startx = parseInt(Math.max(sprgridx - (1 * multiplier), 0));
	var starty = parseInt(Math.max(sprgridy - (1 * multiplier), 0));
	var endx = parseInt(Math.min(sprgridx + 1 + (1 * multiplier), game.state.states.game.map.width));
	var endy = parseInt(Math.min(sprgridy + 1 + (1 * multiplier), game.state.states.game.map.height));
	
	for ( var x = startx ; x <= endx ; x++ ) {
	    for ( var y = starty ; y <= endy ; y++ ) {
		if ( (x == startx ) ||
		     (x == endx ) ||
		     (y == starty ) ||
		     (y == endy) ) {
		    if ( grid.nodes[y][x].walkable == true ) {
			return [x, y];
		    }
		}
	    }   
	}
	throw "No walkable tile found near (" + spr.x + "," + spr.y + ")";
    }

    if ( grid.nodes[sprgridy][sprgridx].walkable == true ) 
	return [sprgridx, sprgridy];
    for ( var i = 1 ; i < 100 ; i++ ) {
	var rv = _walkable_inner(i);
	if ( isSet(rv) ) {
	    return rv
	}
    }
    return [sprgridx, sprgridy];
}

function addAnimation(obj, anim)
{
    a = moonlightSettings['animations'][anim]
    obj.animations.add(anim, a['frames'], a['speed'], a['loop'])
}

function getAwarenessState(spr)
{
    if ( hasState(spr, STATE_UNAWARE) )
	return STATE_UNAWARE;
    if ( hasState(spr, STATE_CONCERNED) )
	return STATE_CONCERNED;
    if ( hasState(spr, STATE_ALERTED) )
	return STATE_ALERTED;
    if ( hasState(spr, STATE_LOSTHIM) )
	return STATE_LOSTHIM;
}

function faceStateFromString(face)
{
    var states = { "up": STATE_FACE_UP,
		   "down": STATE_FACE_DOWN,
		   "left": STATE_FACE_LEFT,
		   "right": STATE_FACE_RIGHT };
    return states[face.toLowerCase()];
}

function getFaceState(spr)
{
    if ( hasState(spr, STATE_FACE_LEFT) )
	return STATE_FACE_LEFT;
    if ( hasState(spr, STATE_FACE_RIGHT) )
	return STATE_FACE_RIGHT;
    if ( hasState(spr, STATE_FACE_DOWN) )
	return STATE_FACE_DOWN;
    if ( hasState(spr, STATE_FACE_UP) )
	return STATE_FACE_UP;
}

function getMoveState(spr)
{
    return ( hasState(spr, STATE_MOVING) ||
	     hasState(spr, STATE_RUNNING) );
}

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

function hasAnyState(spr, states)
{
    var hasstate = false;
    states.forEach(function(x) {
	if ( hasState(spr, x) )
	    hasstate = true;
    }, this);
    return hasstate;
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

function getMovingAnimationName(spr)
{
    var sprbase = "bipedwalk";
    if ( hasState(spr, STATE_RUNNING) )
	sprbase = "bipedrun";
    return sprbase + spriteFacing(spr);
}

function setSpriteMovement(spr, velocity)
{
    var x = 0;
    var y = 0;
    var dir = spriteFacing(spr);
    velocity = ( typeof velocity == undefined ? velocity : [SPEED_WALKING, 
							    SPEED_RUNNING] );

    spr.body.setSize(16, 16, 8, 16);

    if ( hasState(spr, STATE_RUNNING) ) {
	if ( velocity !== false )
	    velocity = velocity[1];
	spr.animations.play("bipedrun" + dir);
    } else if ( hasState(spr, STATE_MOVING) ) {
	if ( velocity !== false )
	    velocity = velocity[0];
	spr.animations.play("bipedwalk" + dir);
    } else {
	if ( velocity !== false ) {
	    spr.body.velocity.x = 0;
	    spr.body.velocity.y = 0;
	}
	spr.animations.stop();
	return;
    }

    if ( velocity !== false ) {
	if ( dir == "left" ) {
	    spr.body.velocity.x = -(velocity * velocity);
	    spr.body.velocity.y = 0;
	} else if ( dir == "right" ) {
	    spr.body.velocity.x = (velocity * velocity);
	    spr.body.velocity.y = 0;
	} else if ( dir == "up" ) {
	    spr.body.velocity.x = 0;
	    spr.body.velocity.y = -(velocity * velocity);
	} else if ( dir == "down" ) {
	    spr.body.velocity.x = 0;
	    spr.body.velocity.y = (velocity * velocity);
	}
    }
}

function genericGridClone()
{
    return pathfinder_grid.clone();
}

function gridWithAISprites()
{
    var grid = pathfinder_grid.clone();
    var aiSprites = game.state.states.game.aiSprites;
    for ( var i = 0 ; i < aiSprites.length ; i++ ) {
	var spr = aiSprites.getChildAt(i);
	// --- We have to normalize the (x,y) because this may be
	// called before the sprites are rebounded back inside the map,
	// and these references will go out of bounds
	var normx = Math.max(parseInt(spr.x/32), 0);
	var normy = Math.max(parseInt(spr.y/32), 0);
	grid.nodes[normy][normx].walkable = false;
    }
    return grid;
}

function stringifyInt(x)
{
    return ("" + x);
}

function isSet(x)
{
    return ( (typeof x !== 'undefined') && 
	     ( x !== null ) );
}

function getDOMValue(name) {
    return document.getElementById(name).value
}

function awardPlayerScoreByState(state) 
{
    switch ( state ) {
	case STATE_ALERTED: {
	    player.score += SCORE_ALERTED;
	}
	case STATE_CONCERNED: {
	    player.score += SCORE_CONCERNED;
	}
	case STATE_LOSTHIM: {
	    player.score += SCORE_LOSTHIM;
	}
    }
}

function getRandomTreasure()
{
    var treasures = Object.keys(moonlightTreasures);
    var treasure = treasures[game.rnd.integerInRange(0, treasures.length)];
    return treasure;
}
