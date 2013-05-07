require('../mode');
var ART = require('../../index');

var art = ART.Surface(1000, 600);

var group = ART.Group()
	.inject(art);

var text = ART.Text('DOM', 'bold 60px "Arial"')
	.move(0, 0)
	.fill('red')
	.inject(group);

var green = ART.Rectangle(100, 100)
	.move(10, 10)
	.fill('green')
	.inject(group);

var group2 = ART.Group()
	.move(10,10)
	.rotate(5)
	.inject(group);

var blue = ART.Rectangle(100, 100)
	.move(10,10)
	.rotate(-5)
	.fill('blue')
	.inject(group2);

function eq(){
	var a = arguments[0];
	for (var i = 1; i < arguments.length; i++){
		var b = arguments[i];
		if (a !== b){ debugger; throw new Error('Assertion failed'); }
	}
}

function verifyState(){
	// art
	//  group
	//   text
	//   green
	//   group2
	//    blue

	eq(art.firstChild, art.lastChild, group);
	eq(group.nextSibling, group.previousSibling, null);

	eq(group.firstChild, text);
	eq(group.lastChild, group2);

	eq(text.previousSibling, group2.nextSibling, null);

	eq(text.nextSibling, green);
	eq(green.previousSibling, text);

	eq(green.nextSibling, group2);
	eq(group2.previousSibling, green);

	eq(group2.firstChild, group2.lastChild, blue);
	eq(blue.nextSibling, blue.previousSibling, null);

	eq(blue.parentNode, group2);
	eq(text.parentNode, green.parentNode, group2.parentNode, group);
	eq(group.parentNode, art);
}

verifyState();

var alt = true;

var timer = setInterval(function(){
	alt = !alt;
	if (alt)
		green.eject();
	else {
		green.injectBefore(group2);
		verifyState();
	}
	group2.rotate(1, 50, 50);
}, 500);

group2.subscribe('click', function(){
	clearInterval(timer);
	group.empty();
	art.empty();
	blue.inject(art);
});

art.inject(document.body);
