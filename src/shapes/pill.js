var Class = require('../core/class');
var Rectangle = require('./rectangle');

module.exports = Class(Rectangle, {

	rectangle_draw: Rectangle.prototype.draw,

	initialize: function(width, height){
		this.shape_initialize();
		if (width != null && height != null) this.draw(width, height);
	},

	draw: function(width, height){
		return this.rectangle_draw(width, height, ((width < height) ? width : height) / 2);
	}
	
});