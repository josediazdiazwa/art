require('../mode');
var SVGParser = require('../../src/parsers/svg');

SVGParser.load('testcase.svg', function(surface){
	surface.inject(document.body);
});
