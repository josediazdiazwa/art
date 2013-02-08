var ComparisonTests = function(){
	this.element = document.createElement('div');
	this.element.setAttribute('class', 'test-results');
	this.tests = [];
};

ComparisonTests.prototype.add = function(test, name){

	var block = document.createElement('div'),
		header = document.createElement('a');
	setText(header, name);
		
	block.setAttribute('class', 'pending');

	header.setAttribute('class', 'header');
	header.setAttribute('href', '?set=' + name);
	block.appendChild(header);

	this.element.appendChild(block);

	this.tests.push({ name: name, test: test, header: header, block: block });
};

ComparisonTests.prototype.run = function(){
	var tests = this.tests;
	var i = -1, l = tests.length, self = this;
	var blank = function(){};
	var next = function(){
		i++;
		if (i >= l) return;
		if (i % 4 == 3){
			self.runItem(tests[i], next);
		} else {
			self.runItem(tests[i], blank);
			next();
		}
	};
	next();
};

function setText(element, text){
	if (element.textContent == null)
		element.innerText = text;
	else
		element.textContent = text;
};

ComparisonTests.prototype.runItem = function(test, tail){
	
	var testFn = test.test, name = test.name, header = test.header, block = test.block;

	block.setAttribute('class', 'loading');
	
	testFn(function(testResult, keyResult, score){

		if (score != null){
			header.textContent += ' [ ' + (Math.round((score) * 10000) / 100) + '% ]';
		}

		block.setAttribute('class', score == null ? 'pending' : score > 0.95 ? 'passed' : 'failed');
	
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

		tail();
		
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