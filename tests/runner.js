var MODE = require('../src/modes/fast');

var SVGParser = require('../src/parsers/svg');

var Specs = require('./specs');

var ComparisonTests = require('./ui/ComparisonTests');
var SetSelector = require('./ui/SetSelector');

var selectedSet = document.location.search.substr(1);

if (!selectedSet){

	var selector = SetSelector(Specs);
	document.body.appendChild(selector);

} else {

	var implementation = document.implementation;
	var hasSVG = (implementation && implementation.hasFeature && implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));

	var tester = new ComparisonTests();

	function createTestRunner(svgPath, pngPath){
		return function(completed, failed){
			var img = new Image();
			img.onload = function(){
				var parser = new SVGParser(MODE);
				parser.load(svgPath, { viewportWidth: img.width, viewportHeight: img.height }, function(result){
					if (result == null){
						failed('Parser Failed: Returned null');
					} else {
						var link = document.createElement('a');
						link.setAttribute('href', svgPath);
						link.title = 'Click to view SVG';
						link.appendChild(img);

						if (hasSVG){
							var svgImg = document.createElement('iframe');
							svgImg.className = 'secondaryKey';
							svgImg.style.width = img.width + 'px';
							svgImg.style.height = img.height + 'px'
							svgImg.src = svgPath;

							link.className = 'primaryKey';

							var wrapper = document.createElement('div');
							wrapper.appendChild(link);
							wrapper.appendChild(svgImg);
							link = wrapper;
						}
						completed(result.toElement(), link);
					}
				});
			};
			img.src = pngPath;
		};
	};

	var sets = Specs.presets[selectedSet];

	function addSet(set){
		var set = Specs.sets[set];

		function addSpec(file){
			tester.add(createTestRunner(set.testPath + file + '.svg', set.keyPath + file + '.png'), file);
		}

		for (var i = 0, l = set.files.length; i < l; i++)
			addSpec(set.files[i]);
	}

	for (var i = 0, l = sets.length; i < l; i++)
		addSet(sets[i]);

	document.body.appendChild(tester.element);

	tester.run();

}