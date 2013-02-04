var Class = require('../../core/class');
var Container = require('../../core/container');
var Element = require('../../dom/element');

var hitContext = null, currentHitTarget, hitX = 0, hitY = 0;

var fps = 1000 / 60, invalids = [], renderTimer, renderInvalids = function(){
	clearTimeout(renderTimer);
	renderTimer = null;
	var canvases = invalids;
	invalids = [];
	for (var i = 0, l = canvases.length; i < l; i++){
		var c = canvases[i];
		c._valid = true;
		c.render();
	}
};

module.exports = Class(Element, Container, {

	initialize: function CanvasSurface(width, height){
		var element = this.element = document.createElement('canvas');
		var context = this.context = element.getContext('2d');
		this.children = [];
		this._valid = true;
		if (width != null && height != null) this.resize(width, height);
		
		if (context.isPointInPath)
			element.addEventListener('mousemove', function(event){
				hitContext = context;
				hitX = event.clientX;
				hitY = event.clientY;
			}, false);
	},

	resize: function(width, height){
		var element = this.element;
		element.setAttribute('width', width);
		element.setAttribute('height', height);
		this.width = width;
		this.height = height;
		return this;
	},
	
	toElement: function(){
		return this.element;
	},
	
	invalidate: function(left, top, width, height){
		if (this._valid){
			this._valid = false;
			invalids.push(this);
			if (!renderTimer){
				if (window.mozRequestAnimationFrame){
					renderTimer = true;
					window.mozRequestAnimationFrame(renderInvalids);
				} else {
					renderTimer = setTimeout(renderInvalids, fps);
				}
			}
		}
	},
	
	render: function(){
		var children = this.children, context = this.context, hitTarget;
		context.clearRect(0, 0, this.width, this.height);
		for (var i = 0, l = children.length; i < l; i++){
			context.save();
			var hit = children[i].renderTo(context);
			if (hit) hitTarget = hit;
			context.restore();
		}
		if (hitContext == context) currentHitTarget = hitTarget;
	}

});