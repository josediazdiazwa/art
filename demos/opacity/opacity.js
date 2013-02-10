require('../mode');
var ART = require('../../art');

var art = ART.Surface(1000, 600);

var group = ART.Group()
	.move(10,10)
	.rotate(-10)
	.blend(0.5)
	.inject(art);

ART.Rectangle(100, 100)
	.move(10,10)
	.fill('green')
	.blend(0.5)
	.rotate(20)
	.inject(group);

var group2 = ART.Group()
	.move(10,10)
	.blend(0.5)
	.rotate(5)
	.inject(group);

ART.Rectangle(100, 100)
	.move(10,10)
	.rotate(-5)
	.fill('blue')
	.blend(0.5)
	.inject(group2);

setInterval(function(){
	group2.rotate(1);
}, 1000 / 60);

art.inject(document.body);