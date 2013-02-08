
function setText(element, text){
	if (element.textContent == null)
		element.innerText = text;
	else
		element.textContent = text;
};

module.exports = function(specs){

	var container = document.createElement('div');
	container.className = 'container';

	var h1 = document.createElement('h1');
	setText(h1, 'ART Test Suite');

	var ul = document.createElement('ul');
	ul.id = 'prebuilt';

	container.appendChild(h1);
	container.appendChild(ul);

	function addPreset(name, sets){
		var li = document.createElement('li');
		var a = document.createElement('a');
		setText(a, name);
		a.href = '?set=' + name;
		li.appendChild(a);
		ul.appendChild(li);
	}

	for (var key in specs.presets)
		addPreset(key, specs.presets[key]);

	return container;

}