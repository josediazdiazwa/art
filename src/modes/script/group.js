var Class = require('../../core/class');
var Container = require('../../core/container');
var Node = require('./node');

module.exports = Class(Node, Container, {

	element_initialize: Node.prototype.initialize,

	initialize: function(){
		this.element_initialize();
		this.children = [];
	},

	element_toExpression: Node.prototype.toExpression,

	toExpression: function(){
		var artGroup = this.artVar.property('Group'),
		    grab = artGroup.construct().property('grab'),
			children = this.children.map(function(child){ return child.toExpression(); });
		return this.element_toExpression(grab.call.apply(grab, children));
	}

});