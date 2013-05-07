var MODE = require('./src/modes/current');
MODE.Rectangle = require('./src/shapes/rectangle');
MODE.Pill = require('./src/shapes/pill');
MODE.Ellipse = require('./src/shapes/ellipse');
MODE.Wedge = require('./src/shapes/wedge');
if (!MODE.Font) MODE.Font = require('./src/shapes/font');
MODE.Transform = require('./src/core/transform');
MODE.Color = require('./src/core/color');
module.exports = MODE;