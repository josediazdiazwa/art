/*
---
name: ART
description: "The heart of ART."
requires: [Core/Class, Color/Color]
provides: [ART, ART.Element, ART.Container, ART.Transform]
...
*/

(function(){

this.ART = new Class;

ART.version = '09.dev';
ART.build = 'DEV';

ART.Element = new Class({
	
	/* dom */

	inject: function(element){
		if (element.element) element = element.element;
		element.appendChild(this.element);
		return this;
	},
	
	eject: function(){
		var element = this.element, parent = element.parentNode;
		if (parent) parent.removeChild(element);
		return this;
	},
	
	/* events */
	
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
			var bound = fn.bind(bind || this);
			var element = this.element;
			if (element.addEventListener){
				element.addEventListener(type, bound, false);
				return function(){ // unsubscribe
					element.removeEventListener(type, bound, false);
					return this;
				};
			} else {
				element.attachEvent('on' + type, bound);
				return function(){ // unsubscribe
					element.detachEvent('on' + type, bound);
					return this;
				};
			}
		}
	}

});

ART.Container = new Class({

	grab: function(){
		for (var i = 0; i < arguments.length; i++) arguments[i].inject(this);
		return this;
	}

});

var transformTo = function(xx, yx, xy, yy, tx, ty){
	if (xx && typeof xx == 'object'){
		yx = xx.yx; yy = xx.yy; ty = xx.ty;
		xy = xx.xy; tx = xx.tx; xx = xx.xx;
	}
	this.xx = xx == null ? 1 : xx;
	this.yx = yx || 0;
	this.xy = xy || 0;
	this.yy = yy == null ? 1 : yy;
	this.tx = (tx == null ? this.tx : tx) || 0;
	this.ty = (ty == null ? this.ty : ty) || 0;
	this._transform();
	return this;
};

var translate = function(x, y){
	this.tx += x || 0;
	this.ty += y || 0;
	this._transform();
	return this;
};
	
ART.Transform = new Class({

	initialize: transformTo,
	
	_transform: function(){},
	
	xx: 1, yx: 0, tx: 0,
	xy: 0, yy: 1, ty: 0,
	
	transform: function(xx, yx, xy, yy, tx, ty){
		var m = this;
		if (xx && typeof xx == 'object'){
			yx = xx.yx; yy = xx.yy; ty = xx.ty;
			xy = xx.xy; tx = xx.tx; xx = xx.xx;
		}
		if (!tx) tx = 0;
		if (!ty) ty = 0;
		return this.transformTo(
			m.xx * xx + m.xy * yx,
			m.yx * xx + m.yy * yx,
			m.xx * xy + m.xy * yy,
			m.yx * xy + m.yy * yy,
			m.xx * tx + m.xy * ty + m.tx,
			m.yx * tx + m.yy * ty + m.ty
		);
	},
	
	transformTo: transformTo,
	
	translate: translate,
	move: translate,
	
	scale: function(x, y){
		if (y == null) y = x;
		return this.transform(x, 0, 0, y, 0, 0);
	},
	
	rotate: function(deg, x, y){
		var rad = deg * Math.PI / 180, sin = Math.sin(rad), cos = Math.cos(rad);
		
		this.transform(1, 0, 0, 1, x, y);
		var m = this;

		return this.transformTo(
			cos * m.xx - sin * m.yx,
			sin * m.xx + cos * m.yx,
			cos * m.xy - sin * m.yy,
			sin * m.xy + cos * m.yy,
			m.tx,
			m.ty
		).transform(1, 0, 0, 1, -x, -y);
	},
	
	moveTo: function(x, y){
		var m = this;
		return this.transformTo(m.xx, m.yx, m.xy, m.yy, x, y);
	},
	
	rotateTo: function(deg, x, y){
		var m = this;
	    var flip = m.yx / m.xx > m.yy / m.xy ? -1 : 1;
		if (m.xx < 0 ? m.xy >= 0 : m.xy < 0) flip = -flip;
		return this.rotate(deg - Math.atan2(flip * m.yx, flip * m.xx) * 180 / Math.PI, x, y);
	},
	
	scaleTo: function(x, y){
		// Normalize
		var m = this;

		var h = Math.sqrt(m.xx * m.xx + m.yx * m.yx);
		m.xx /= h; m.yx /= h;

		h = Math.sqrt(m.yy * m.yy + m.xy * m.xy);
		m.yy /= h; m.xy /= h;

		return this.scale(x, y);
	},
	
	point: function(x, y){
		var m = this;
		return {
			x: m.xx * x + m.xy * y + m.tx,
			y: m.yx * x + m.yy * y + m.ty
		};
	}

});

Color.detach = function(color){
	color = new Color(color);
	return [Color.rgb(color.red, color.green, color.blue).toString(), color.alpha];
};

})();

