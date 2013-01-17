/*
---
name: ART.Canvas.Base
description: "Implements ART, ART.Shape and ART.Group based on the current browser."
provides: [ART.Base, ART.Group, ART.Shape, ART.Text]
requires: [ART.Canvas]
...
*/

(function(){
	
var Canvas = function(){

	var canvas = document.createElement('canvas');
	return canvas && !!canvas.getContext;

};

var Flash = function(){

	var flash = navigator.plugins && navigator.plugins['Shockwave Flash'];
	try { flash = flash ? flash.description : new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version'); } 
	catch (x){ }
	return flash && flash.match(/\d+/) >= 9;

};

var MODE = Canvas() ? ART.Canvas : Flash() ? ART.Flash : null;
if (!MODE) return;

ART.Path = MODE.Path;
ART.Shape = MODE.Shape;
ART.Group = MODE.Group;
ART.Text = MODE.Text;
ART.prototype = MODE.prototype;

})();
