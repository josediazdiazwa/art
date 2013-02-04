var Class = require('../../core/class');
var Color = require('../../core/color');
var Transform = require('../../core/Transform');
var Node = require('./node');

var genericContext = document.createElement('canvas');
genericContext = genericContext.getContext && genericContext.getContext('2d');

var Base = Class(Node, {

	initialize: function(){
	},
	
	/* styles */
	
	_addColors: function(gradient, stops){
		// Enumerate stops, assumes offsets are enumerated in order
		// TODO: Sort. Chrome doesn't always enumerate in expected order but requires stops to be specified in order.
		if ('length' in stops) for (var i = 0, l = stops.length - 1; i <= l; i++)
			gradient.addColorStop(i / l, new Color(stops[i]).toString());
		else for (var offset in stops)
			gradient.addColorStop(offset, new Color(stops[offset]).toString());
		return gradient;
	},

	
	fill: function(color){
		if (arguments.length > 1) return this.fillLinear(arguments);
		else this._fill = color ? new Color(color).toString() : null;
		return this.invalidate();
	},

	fillRadial: function(stops, focusX, focusY, radiusX, radiusY, centerX, centerY){
		if (focusX == null) focusX = (this.left || 0) + (this.width || 0) * 0.5;
		if (focusY == null) focusY = (this.top || 0) + (this.height || 0) * 0.5;
		if (radiusY == null) radiusY = radiusX || (this.height * 0.5) || 0;
		if (radiusX == null) radiusX = (this.width || 0) * 0.5;
		if (centerX == null) centerX = focusX;
		if (centerY == null) centerY = focusY;

		centerX += centerX - focusX;
		centerY += centerY - focusY;
		
		if (radiusX == 0) return this.fillLinear(stops);
		var ys = radiusY / radiusX;

		var gradient = genericContext.createRadialGradient(focusX, focusY / ys, 0, centerX, centerY / ys, radiusX * 2);

		// Double fill radius to simulate repeating gradient
		if ('length' in stops) for (var i = 0, l = stops.length - 1; i <= l; i++){
			gradient.addColorStop(i / l / 2, new Color(stops[i]).toString());
			gradient.addColorStop(1 - i / l / 2, new Color(stops[i]).toString());
		} else for (var offset in stops){
			gradient.addColorStop(offset / 2, new Color(stops[offset]).toString());
			gradient.addColorStop(1- offset / 2, new Color(stops[offset]).toString());
		}

		this._fill = gradient;
		this._fillTransform = new Transform(1, 0, 0, ys);
		return this.invalidate();
	},

	fillLinear: function(stops, x1, y1, x2, y2){
		if (arguments.length < 5) return this;
		var gradient = genericContext.createLinearGradient(x1, y1, x2, y2);
		this._addColors(gradient, stops);
		this._fill = gradient;
		this._fillTransform = null;
		return this.invalidate();
	},

	fillImage: function(url, width, height, left, top, color1, color2){
		return this.invalidate();
	},

	stroke: function(color, width, cap, join){
		this._stroke = color ? new Color(color).toString() : null;
		this._strokeWidth = (width != null) ? width : 1;
		this._strokeCap = (cap != null) ? cap : 'round';
		this._strokeJoin = (join != null) ? join : 'round';
		return this.invalidate();
	}

});

Base._genericContext = genericContext;

module.exports = Base;