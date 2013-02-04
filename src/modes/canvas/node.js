var Class = require('../../core/class');
var Transform = require('../../core/transform');

module.exports = Class(Transform, {

	inject: function(container){
		this.eject();
		this.container = container;
		container.children.push(this);
		return this.invalidate();
	},

	eject: function(){
		var container = this.container;
		if (container){
			var siblings = container.children,
			    i = siblings.length;
			while (i--)
				if (siblings[i] === this)
					siblings.splice(i, 1);
		}
		this.invalidate();
		this.container = null;
		return this;
	},
	
	invalidate: function(){
		if (this.container) this.container.invalidate();
		return this;
	},
	
	// transforms
	
	_transform: function(){
		this.invalidate();
	},
	
	blend: function(opacity){
		return this.invalidate();
	},
	
	// visibility
	
	hide: function(){
		this._invisible = true;
		return this.invalidate();
	},
	
	show: function(){
		this._invisible = false;
		return this.invalidate();
	},
	
	// interaction
	
	indicate: function(cursor, tooltip){
		return this.invalidate();
	}

});