var Class = require('../../core/class');
var Container = require('../../core/container');
var Modulizer = require('./modulizer');

module.exports = Class(Container, Modulizer, {

	initialize: function(width, height){
		this.resize(width, height);
		this.children = [];
	},

	resize: function(width, height){
		this.width = width;
		this.height = height;
		return this;
	},

	toExpression: function(){
		var expr = this.artVar.property('Surface').construct(this.width, this.height);
		if (!this.children.length) return expr;
		var grab = expr.property('grab');
		return grab.call.apply(grab, this.children);
	},

	// ignore
	
	subscribe: function(){
		return this;
	}

});