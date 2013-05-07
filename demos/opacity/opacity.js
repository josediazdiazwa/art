require('../mode');
var ART = require('../../index');

var art = ART.Surface(1000, 600);

var group = ART.Group()
	.move(10,10)
	.rotate(-10)
	.blend(0.5)
	.inject(art);

var green = ART.Rectangle(100, 100)
	.move(10,10)
	.fill('green')
	.blend(0.5)
	.rotate(20)
	.indicate('pointer', 'Green square')
	.inject(group);

var group2 = ART.Group()
	.move(10,10)
	.blend(0.5)
	.rotate(5)
	.indicate(null, 'Blue square')
	.inject(group);

var blue = ART.Rectangle(100, 100)
	.move(10,10)
	.rotate(-5)
	.fill('blue')
	.blend(0.5)
	.indicate('move')
	.inject(group2);

setInterval(function(){
	group2.rotate(1);
}, 1000 / 60);

blue.subscribe({
	'mouseover': function(){
		blue.blend(1);
	},
	'mouseout': function(){
		blue.blend(0.5);
	}
});

group2.subscribe('click', function(){
	this.blend(1);
	blue.indicate('wait');
});

art.inject(document.body);
