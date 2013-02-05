require('../../src/modes/script');
var ART = require('../../art');

var art = new ART.Surface(100, 100);

var tripath = new ART.Path()
	.move(50, 0)
	.line(50, 100)
	.line(-100, 0)
	.line(50, -100)
	.close();

var triangle = new ART.Shape(tripath).fill('rgb(255, 0, 0)');

var rectangle = new ART.Rectangle(100, 100).rotate(45).stroke('#0F0', 2);

art.grab(triangle, rectangle);

alert(art.toExpression().toString());
alert(art.toModule().toString());