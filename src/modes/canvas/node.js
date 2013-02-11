var Class = require('../../core/class');
var Transform = require('../../core/transform');

var CanvasNode = Class(Transform, {

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
		if (this._layer) this._layerCache = null;
		return this;
	},
	
	// transforms
	
	_transform: function(){
		this.invalidate();
	},
	
	blend: function(opacity){
		if (opacity >= 1 && this._layer) this._layer = null;
		this._opacity = opacity;
		if (this.container) this.container.invalidate();
		return this;
	},
	
	// visibility
	
	hide: function(){
		this._invisible = true;
		if (this.container) this.container.invalidate();
		return this;
	},
	
	show: function(){
		this._invisible = false;
		if (this.container) this.container.invalidate();
		return this;
	},
	
	// interaction
	
	indicate: function(cursor, tooltip){
		this._cursor = cursor;
		this._tooltip = tooltip;
		return this.invalidate();
	},

	hitTest: function(x, y){
		if (this._invisible) return null;
		var point = this.inversePoint(x, y);
		if (!point) return null;
		return this.localHitTest(point.x, point.y);
	},

	// events

	dispatch: function(event){
		var events = this._events,
			listeners = events && events[event.type];
		if (listeners){
			listeners = listeners.slice(0);
			for (var i = 0, l = listeners.length; i < l; i++){
				var fn = listeners[i], result;
				if (typeof fn == 'function')
					result = fn.call(this, event);
				else
					result = fn.handleEvent(event);
				if (result === false) event.preventDefault();
			}
		}
		if (this.container && this.container.dispatch){
			this.container.dispatch(event);
		}
	},

	subscribe: function(type, fn, bind){
		if (typeof type != 'string'){ // listen type / fn with object
			var subscriptions = [];
			for (var t in type) subscriptions.push(this.subscribe(t, type[t]));
			return function(){ // unsubscribe
				for (var i = 0, l = subscriptions.length; i < l; i++)
					subscriptions[i]();
				return this;
			};
		} else { // listen to one
			var bound = typeof fn === 'function' ? fn.bind(bind || this) : fn,
				events = this._events || (this._events = {}),
				listeners = events[type] || (events[type] = []);
			listeners.push(bound);
			return function(){
				// unsubscribe
				for (var i = 0, l = listeners.length; i < l; i++){
					if (listeners[i] === bound){
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}
	},

	// rendering

	renderTo: function(context, xx, yx, xy, yy, x, y){
		var opacity = this._opacity;
		if (opacity == null || opacity >= 1){
			return this.renderLayerTo(context, xx, yx, xy, yy, x, y);
		}

		// Render to a compositing layer and cache it

		var layer = this._layer, canvas, isDirty = true,
			w = context.canvas.width, h = context.canvas.height;
		if (layer){
			layer.setTransform(1, 0, 0, 1, 0, 0);
			canvas = layer.canvas;
			if (canvas.width < w || canvas.height < h){
				canvas.width = w;
				canvas.height = h;
			} else {
				var c = this._layerCache;
				if (c && c.xx === xx && c.yx === yx && c.xy === xy
					&& c.yy === yy && c.x === x && c.y === y){
					isDirty = false;
				} else {
					layer.clearRect(0, 0, w, h);
				}
			}
		} else {
			canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			this._layer = layer = canvas.getContext('2d');
		}

		if (isDirty){
			this.renderLayerTo(layer, xx, yx, xy, yy, x, y);
			this._layerCache = {
				xx: xx,
				yx: yx,
				xy: xy,
				yy: yy,
				x: x,
				y: y
			};
		}

		context.globalAlpha = opacity;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.drawImage(
			canvas,
			0, 0, w, h,
			0, 0, w, h
		);
		context.globalAlpha = 1;
	}

});

module.exports = CanvasNode;