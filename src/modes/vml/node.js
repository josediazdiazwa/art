var Class = require('../../core/class');
var Transform = require('../../core/transform');
var Element = require('../../dom/element');
var DOM = require('./dom');

module.exports = Class(Element, Transform, {
	
	initialize: function(tag){
		//this.uid = uniqueID();
		var element = this.element = DOM.createElement(tag);
		//element.setAttribute('id', 'e' + this.uid);
	},
	
	/* dom */

	art_element_inject: Element.prototype.inject,
	
	inject: function(container){
		this.eject();
		this.container = container;
		container.children.push(this);
		this._transform();
		this.art_element_inject(container);
		
		return this;
	},

	art_element_eject: Element.prototype.eject,

	eject: function(){
		if (this.container){
			var siblings = this.container.children,
			    i = siblings.length;
			while (i--)
				if (siblings[i] === this)
					siblings.splice(i, 1);
			this.container = null;
			this.art_element_eject();
		}
		return this;
	},

	// visibility
	
	hide: function(){
		this.element.style.display = 'none';
		return this;
	},
	
	show: function(){
		this.element.style.display = '';
		return this;
	},
	
	// interaction
	
	indicate: function(cursor, tooltip){
		if (cursor) this.element.style.cursor = cursor;
		if (tooltip) this.element.title = tooltip;
		return this;
	}

});
