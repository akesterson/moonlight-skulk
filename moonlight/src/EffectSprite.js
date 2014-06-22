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

