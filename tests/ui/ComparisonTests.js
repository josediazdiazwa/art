var ComparisonTests = function(){
	this.element = document.createElement('div');
	this.element.setAttribute('class', 'test-results');
	this.tests = [];
};

ComparisonTests.prototype.add = function(test, name){
	this.tests.push({ name: name, test: test });
};

ComparisonTests.prototype.run = function(){
	var tests = this.tests;
	var i = -1, l = tests.length, self = this;
	var next = function(){
		i++;
		if (i >= l) return;
		self.runItem(tests[i].test, tests[i].name, next);
	};
	next();
};

function setText(element, text){
	if (element.textContent == null)
		element.innerText = text;
	else
		element.textContent = text;
};

ComparisonTests.prototype.runItem = function(testFn, name, tail){
	var block = document.createElement('div'),
		header = document.createElement('a');
	setText(header, name);
		
	header.setAttribute('class', 'header');
	header.setAttribute('href', '?' + name);
	block.appendChild(header);

	this.element.appendChild(block);
	
	block.setAttribute('class', 'loading');
	
	testFn(function(testResult, keyResult){

		block.setAttribute('class', 'pending');
	
		var test = document.createElement('div');
		test.setAttribute('class', 'test');
		
		var testHeader = document.createElement('span');
		testHeader.setAttribute('class', 'title');
		setText(testHeader, 'Test');

		var key = document.createElement('div');
		key.setAttribute('class', 'key');

		var keyHeader = document.createElement('span');
		keyHeader.setAttribute('class', 'title');
		setText(keyHeader, 'Key');

		test.appendChild(testHeader);
		key.appendChild(keyHeader);

		key.appendChild(keyResult);
		test.appendChild(testResult);

		block.appendChild(key);

		block.appendChild(test);
		
		setTimeout(tail, 0);
		
	}, function(x){

		block.setAttribute('class', 'failed');
	
		var err = document.createElement('div');
		err.setAttribute('class', 'error');
		setText(err, x);
		block.appendChild(err);
		
		setTimeout(tail, 0);
		
	});
};

module.exports = ComparisonTests;