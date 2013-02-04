var MODE;
switch (location.search){
	case '?vml': MODE = require('../src/modes/vml'); break;
	case '?svg': MODE = require('../src/modes/svg'); break;
	case '?canvas': MODE = require('../src/modes/canvas'); break;
	case '?dom': MODE = require('../src/modes/dom'); break;
	default: MODE = require('../src/modes/fast');
}
require('../src/modes/current').setCurrent(MODE);
module.exports = MODE;