var Class = require('../core/class');
var Mode = require('../modes/current');

module.exports = Class(Mode.Shape, {

	shape_initialize: Mode.Shape.prototype.initialize,
	shape_draw: Mode.Shape.prototype.draw,
	
	initialize: function(width, height){
		this.shape_initialize();
		if (width != null && height != null) this.draw(width, height);
	},
	
	draw: function(width, height){
		var path = new Mode.Path();
		var rx = width / 2, ry = height / 2;
		path.move(0, ry).arc(width, 0, rx, ry).arc(-width, 0, rx, ry);
		
		path.close();
		
		return this.shape_draw(path, width, height);
	}

});