
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
    this.rect = positiveRectangle(this.x - radius, this.y - radius, radius * 2, radius * 2)
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
    this.rect = positiveRectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
}
