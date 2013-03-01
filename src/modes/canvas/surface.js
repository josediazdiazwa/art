var Class = require('../../core/class');
var Container = require('../../core/container');
var Element = require('../../dom/element');

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

var previousHit = null;

var CanvasSurface = Class(Element, Container, {

	initialize: function(width, height){
		var element = this.element = document.createElement('canvas');
		var context = this.context = element.getContext('2d');
		this.children = [];
		this._valid = true;
		if (width != null && height != null) this.resize(width, height);

		element.addEventListener('mousemove', this, false);
		element.addEventListener('mouseout', this, false);
		element.addEventListener('mouseover', this, false);
		element.addEventListener('mouseup', this, false);
		element.addEventListener('mousedown', this, false);
		element.addEventListener('click', this, false);
	},

	handleEvent: function(event){
		if (event.clientX == null) return;
		var element = this.element,
			rect = element.getBoundingClientRect(),
			x = event.clientX - rect.left - element.clientLeft,
			y = event.clientY - rect.top - element.clientTop,
			hit = this.hitTest(x, y);

		if (hit !== previousHit){
			if (previousHit){
				previousHit.dispatch({
					type: 'mouseout',
					target: previousHit,
					relatedTarget: hit,
					sourceEvent: event
				});
			}
			if (hit){
				hit.dispatch({
					type: 'mouseover',
					target: hit,
					relatedTarget: previousHit,
					sourceEvent: event
				});
			}
			previousHit = hit;
			var hitCursor = '', hitTooltip = '';
			while (hit){
				if (!hitCursor && hit._cursor){
					hitCursor = hit._cursor;
					if (hitTooltip) break;
				}
				if (!hitTooltip && hit._tooltip){
					hitTooltip = hit._tooltip;
					if (hitCursor) break;
				}
				hit = hit.container;
			}
			this.element.style.cursor = hitCursor;
			this.element.title = hitTooltip;
		}

		if (hit) hit.dispatch(event);
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

	hitTest: function(x, y){
		if (x < 0 || y < 0 || x > this.width || y > this.height) return null;
		var children = this.children, i = children.length;
		while (i--){
			var hit = children[i].hitTest(x, y);
			if (hit) return hit;
		}
		return null;
	},

	render: function(){
		var children = this.children, context = this.context;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, this.width, this.height);
		for (var i = 0, l = children.length; i < l; i++){
			children[i].renderTo(context, 1, 0, 0, 1, 0, 0);
		}
	}

});

module.exports = CanvasSurface;