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
