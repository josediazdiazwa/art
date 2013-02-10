var Class = require('../../core/class');
var Base = require('./base');

var fontAnchors = { middle: 'center' };

module.exports = Class(Base, {

	base_initialize: Base.prototype.initialize,

	initialize: function(text, font, alignment, path){
		this.base_initialize();
		this.draw.apply(this, arguments);
	},
	
	draw: function(text, font, alignment, path){
		var em;
		if (typeof font == 'string'){
			em = Number(/(\d+)/.exec(font)[0]);
		} else if (font){
			em = parseFloat(font.fontSize || font['font-size'] || '12');
			font = (font.fontStyle || font['font-style'] || '') + ' ' +
				(font.fontVariant || font['font-variant'] || '') + ' ' +
				(font.fontWeight || font['font-weight'] || '') + ' ' +
				em + 'px ' +
				(font.fontFamily || font['font-family'] || 'Arial');
		} else {
			font = this._font;
		}

		var lines = text && text.split(/\r?\n/);
		this._font = font;
		this._fontSize = em;
		this._text = lines;
		this._alignment = fontAnchors[alignment] || alignment || 'left';
		
		var context = Base._genericContext;

		context.font = this._font;
		context.textAlign = this._alignment;
		context.textBaseline = 'middle';
		
		var lines = this._text, l = lines.length, width = 0;
		for (var i = 0; i < l; i++){
			w = context.measureText(lines[i]).width;
			if (w > width) width = w;
		}
		this.width = width;
		this.height = l ? l * 1.1 * em : 0;
		return this.invalidate();
	},

	renderShapeTo: function(context){
		if (this._invisible || !this._text || (!this._fill && !this._stroke)) return null;
		context.transform(this.xx, this.yx, this.xy, this.yy, this.x, this.y);
		var fill = this._fill, stroke = this._stroke, text = this._text;
		
		context.font = this._font;
		context.textAlign = this._alignment;
		context.textBaseline = 'middle';
		
		var em = this._fontSize,
			y = em / 2,
			lineHeight = 1.1 * em,
			lines = this._text,
			l = lines.length;
		
		if (fill){
			context.fillStyle = fill;
			for (var i = 0; i < l; i++)
				context.fillText(lines[i], 0, y + i * lineHeight);
		}
		if (stroke){
			context.strokeStyle = stroke;
			context.lineWidth = this._strokeWidth;
			context.lineCap = this._strokeCap;
			context.lineJoin = this._strokeJoin;
			for (var i = 0; i < l; i++)
				context.strokeText(lines[i], 0, y + i * lineHeight);
		}
		
		return /*hitContext == context && context.isPointInPath(hitX, hitY) ? this :*/ null;
	}

});