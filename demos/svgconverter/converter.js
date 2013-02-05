require('../../src/modes/script');
var SVGParser = require('../../src/parsers/svg');

SVGParser.load('../svgviewer/testcase.svg', function(surface){
	var result = document.createElement('textarea');
	result.value = surface.toModule();
	document.body.appendChild(result);
});