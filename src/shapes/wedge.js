var Class = require('../core/class');
var Mode = require('../modes/current');

module.exports = Class(Mode.Shape, {

	shape_initialize: Mode.Shape.prototype.initialize,
	shape_draw: Mode.Shape.prototype.draw,

	initialize: function(innerRadius, outerRadius, startAngle, endAngle){
		this.shape_initialize();
		if (innerRadius != null || outerRadius != null) this.draw(innerRadius, outerRadius, startAngle, endAngle);
	},

	draw: function(innerRadius, outerRadius, startAngle, endAngle){
		var path = new Mode.Path();

		var circle = Math.PI * 2,
			radiansPerDegree = Math.PI / 180,
			sa = startAngle * radiansPerDegree % circle || 0,
			ea = endAngle * radiansPerDegree % circle || 0,
			ir = Math.min(innerRadius || 0, outerRadius || 0),
			or = Math.max(innerRadius || 0, outerRadius || 0),
			a = sa > ea ? circle - sa + ea : ea - sa;

		if (a >= circle){

			path.move(0, or).arc(or * 2, 0, or).arc(-or * 2, 0, or);
			if (ir) path.move(or - ir, 0).counterArc(ir * 2, 0, ir).counterArc(-ir * 2, 0, ir);

		} else {

			var ss = Math.sin(sa), es = Math.sin(ea),
				sc = Math.cos(sa), ec = Math.cos(ea),
				ds = es - ss, dc = ec - sc, dr = ir - or,
				large = a > Math.PI;

			path.move(or + or * ss, or - or * sc).arc(or * ds, or * -dc, or, or, large).line(dr * es, dr * -ec);
			if (ir) path.counterArc(ir * -ds, ir * dc, ir, ir, large);

		}

		path.close();
		return this.shape_draw(path, or * 2, or * 2);
	}

});