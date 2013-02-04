var Class = require('../../core/class');
var Container = require('../../core/container');
var Element = require('../../dom/element');
var DOM = require('./dom');

var precision = 100;

module.exports = Class(Element, Container, {
	
	initialize: function VMLSurface(width, height){
		this.vml = document.createElement('vml');
		this.element = DOM.createElement('group');
		this.vml.appendChild(this.element);
		this.children = [];
		if (width != null && height != null) this.resize(width, height);
	},

	eject: function(){
		var element = this.vml, parent = element.parentNode;
		if (parent) parent.removeChild(element);
		return this;
	},
	
	inject: function(element){
		if (element.element) element = element.element;
		element.appendChild(this.vml);
		return this;
	},
	
	resize: function(width, height){
		this.width = width;
		this.height = height;
		
		var style = this.vml.style;
		style.pixelWidth = width;
		style.pixelHeight = height;
		
		style = this.element.style;
		style.width = width;
		style.height = height;
		
		var halfPixel = (0.5 * precision);
		
		this.element.coordorigin = halfPixel + ',' + halfPixel;
		this.element.coordsize = (width * precision) + ',' + (height * precision);

		return this;
	},
	
	toElement: function(){
		return this.vml;
	}
	
});
