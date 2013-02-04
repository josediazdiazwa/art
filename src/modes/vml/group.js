var Class = require('../../core/class');
var Transform = require('../../core/transform');
var Container = require('../../core/container');
var Node = require('./node');

module.exports = Class(Node, Container, {
	
	element_initialize: Node.prototype.initialize,
	
	initialize: function(width, height){
		this.element_initialize('group');
		this.width = width;
		this.height = height;
		this.children = [];
	},
	
	element_inject: Node.prototype.inject,
	
	inject: function(container){
		this.element_inject(container);
		this._transform();
		return this;
	},

	element_eject: Node.prototype.eject,
	
	eject: function(){
		this.element_eject();
		return this;
	},
	
	_transform: function(){
		var element = this.element;
		element.coordorigin = '0,0';
		element.coordsize = '1000,1000';
		element.style.left = 0;
		element.style.top = 0;
		element.style.width = 1000;
		element.style.height = 1000;
		element.style.rotation = 0;
		
		var container = this.container;
		this._activeTransform = container ? new Transform(container._activeTransform).transform(this) : this;
		var children = this.children;
		for (var i = 0, l = children.length; i < l; i++)
			children[i]._transform();
	}

});