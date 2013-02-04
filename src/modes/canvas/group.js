var Class = require('../../core/class');
var Container = require('../../core/container');
var Node = require('./node');

module.exports = Class(Node, Container, {
	
	initialize: function(width, height){
		this.width = width;
		this.height = height;
		this.children = [];
	},
	
	// rendering
	
	renderTo: function(context){
		if (this._invisible) return null;
		var children = this.children, hitTarget;
		for (var i = 0, l = children.length; i < l; i++){
			context.save();
			context.transform(this.xx, this.yx, this.xy, this.yy, this.x, this.y);
			var hit = children[i].renderTo(context);
			if (hit) hitTarget = hit;
			context.restore();
		}
		return hitTarget;
	}

});
