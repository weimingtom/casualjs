/**
 * CasualJS Framework by Flashlizi, Copyright (c) 2011 RIAidea.com
 * Project Homepage: www.html5idea.com and http://code.google.com/p/casualjs/
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function(){
/**
 * Abstract class for a display object, it should not be constructed directly.
 * @name DisplayObject
 * @class
 */
var DisplayObject = function()
{
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.alpha = 1;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotation = 0;
	this.regX = 0;
	this.regY = 0;
	this.visible = true;
	this.name = null;
	this.id = null;
	this.mouseEnabled = true;
	this.parent = null;
	this.stage = null;
}
casual.inherit(DisplayObject, casual.EventDispatcher);
casual.DisplayObject = DisplayObject;

DisplayObject.prototype.getCurrentWidth = function()
{
	return Math.abs(this.width*this.scaleX);
}

DisplayObject.prototype.getCurrentHeight = function()
{
	return Math.abs(this.height*this.scaleY);
}

DisplayObject.prototype.getStage = function()
{
	if(this.stage) return this.stage;
	var p = this;
	while(p.parent) p = p.parent;
	if(p instanceof casual.Stage) return this.stage = p;
	return null;
}

DisplayObject.prototype.localToGlobal = function(x, y)
{
	var cm = this.getConcatenatedMatrix();
	if (cm == null) return {x:0, y:0};
	var m = new casual.Matrix(1, 0, 0, 1, x, y);
	m.concat(cm);
	return {x:m.tx, y:m.ty};
}

DisplayObject.prototype.globalToLocal = function(x, y) 
{
	var cm = this.getConcatenatedMatrix();
	if (cm == null) return {x:0, y:0};
	cm.invert();
	var m = new casual.Matrix(1, 0, 0, 1, x, y);
	m.concat(cm);
	return {x:m.tx, y:m.ty};
}

DisplayObject.prototype.localToTarget = function(x, y, target) 
{
	var p = localToGlobal(x, y);
	return target.globalToLocal(p.x, p.y);
}

DisplayObject.prototype.getConcatenatedMatrix = function() 
{
	//TODO: cache the concatenated matrix to increase performance
	var mtx = new casual.Matrix();
	for (var o = this; o != null; o = o.parent)
	{
		mtx.concatTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.regX, o.regY);
		if(o instanceof casual.Stage) break;
	}	
	return mtx;
}

DisplayObject.prototype._transform = function(context, toGlobal)
{	
	if(toGlobal)
	{
		var p = this.localToGlobal(0, 0);
		if(p.x != 0 || p.y != 0) context.translate(p.x, p.y);
	}else
	{
		context.translate(this.x, this.y);
	}
		
	if(this.rotation%360 > 0) context.rotate(this.rotation%360/180*Math.PI);
	if(this.scaleX != 1 || this.scaleY != 1) context.scale(this.scaleX, this.scaleY);
	if(!toGlobal) context.translate(-this.regX, -this.regY);
	context.globalAlpha *= this.alpha;
}

/**
 * Render wrapper, prepare and restore context.
 * @param context The context render to
 * @param noTransform Whether do transformation or not, default is do transformation.
 * @param globalTransform Whether do global transformation or not
 * @private
 */
DisplayObject.prototype._render = function(context, noTransform, globalTransform)
{	
	context.save();
	if(!noTransform) this._transform(context, globalTransform);
	this.render(context);
	context.restore();
}

/**
 * The real rendering workhorse, normally it should be overridden by subclass.
 */
DisplayObject.prototype.render = function(context) { };

DisplayObject.prototype.hitTestPoint = function(x, y, usePixelCollision, tolerance)
{
	if(!usePixelCollision)
	{
		var p = this.globalToLocal(x, y);
		return p.x >= 0 && p.x <= this.getCurrentWidth() && p.y >= 0 && p.y <= this.getCurrentHeight();
	}
	
	var stage = this.getStage();
	if(stage == null) return false;
	var tempContext = stage.__getTempContext();
	
	//default tolerance is 50
	if(tolerance == undefined) tolerance = 50;
	//render this displayobject to the temp context
	this._render(tempContext, false, true);
	var result = false;
	try
	{		
		//get image data (format:RGBA) by 1*1 rectangle, then check if it's transparent
		var data = tempContext.getImageData(x, y, 1, 1).data;
		//trace("hitTestPoint", this, data[0], data[1], data[2], data[3], tolerance);
		if(data[3] > tolerance) result = true;
	}catch(e)
	{
		//nothing, throw error?
		trace("hitTestPoint", this, e);
	};
	
	//clear canvas and return result
	tempContext.canvas.width = 0;
	return result;
}

DisplayObject.prototype.toString = function()
{
	return NameUtil.displayObjectToString(this);
}

})();