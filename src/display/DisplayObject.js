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
 * Constructor.
 * @name DisplayObject
 * @class The DisplayObject class is the base class for all objects that can be placed on the canvas.<br>DisplayObject is an abstract base class, therefore, you cannot call DisplayObject directly.<br>All display objects should inherit from the DisplayObject class, and implement the render() method.
 * @augments EventDispatcher
 * @property id Indicates the instance id of the DisplayObject.
 * @property name Indicates the instance name of the DisplayObject.
 * @property x Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
 * @property y Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
 * @property width Indicates the width of the display object, in pixels.
 * @property height Indicates the height of the display object, in pixels.
 * @property regX Indicates the x coordinate of registration point of the display object.
 * @property regY Indicates the x coordinate of registration point of the display object.
 * @property scaleX Indicates the horizontal scale (percentage) of the object as applied from the registration point.
 * @property scaleY Indicates the vertical scale (percentage) of an object as applied from the registration point of the object.
 * @property alpha Indicates the alpha transparency value of the object specified.
 * @property rotation Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation.
 * @property visible Whether or not the display object is visible.
 * @property mouseEnabled Specifies whether this object receives mouse messages.
 * @property useHandCursor A Boolean value that indicates whether the pointing hand (hand cursor) appears when the mouse rolls over the display object.
 * @property parent The reference of the DisplayObjectContainer object that contains this display object.
 * @property stage The reference of the Stage of the display object.
 */
var DisplayObject = function()
{
	casual.EventDispatcher.call(this);
	this.name = NameUtil.createUniqueName("DisplayObject");
	
	this.id = null;	
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
	this.mouseEnabled = true;
	this.useHandCursor = false;
	this.parent = null;
	this.stage = null;	
}
casual.inherit(DisplayObject, casual.EventDispatcher);
casual.DisplayObject = DisplayObject;

//intenal canvas for hit testing usage
var canvas = document.createElement("canvas");
canvas.width = canvas.height = 1;
DisplayObject.__hitTestContext = canvas.getContext("2d");
DisplayObject.__hitTestTolerance = 50;

/**
 * Gets the scaled width of the display object currently, in pixels.
 */
DisplayObject.prototype.getCurrentWidth = function()
{
	return Math.abs(this.width * this.scaleX);
}

/**
 * Gets the scaled height of the display object currently, in pixels.
 */
DisplayObject.prototype.getCurrentHeight = function()
{
	return Math.abs(this.height * this.scaleY);
}

/**
 * Gets the stage reference, rather than using DisplayObject.stage, you'd better use DisplayObject.getStage().
 */
DisplayObject.prototype.getStage = function()
{
	if(this.stage) return this.stage;
	var p = this;
	while(p.parent) p = p.parent;
	if(p instanceof casual.Stage) return this.stage = p;
	return null;
}

/**
 * Converts the (x, y) point from the display object's (local) coordinates to the Stage (global) coordinates.
 */
DisplayObject.prototype.localToGlobal = function(x, y)
{
	var cm = this.getConcatenatedMatrix();
	if (cm == null) return {x:0, y:0};
	var m = new casual.Matrix(1, 0, 0, 1, x, y);
	m.concat(cm);
	return {x:m.tx, y:m.ty};
}

/**
 * Converts the (x, y) point from the Stage (global) coordinates to the display object's (local) coordinates.
 */
DisplayObject.prototype.globalToLocal = function(x, y) 
{
	var cm = this.getConcatenatedMatrix();
	if (cm == null) return {x:0, y:0};
	cm.invert();
	var m = new casual.Matrix(1, 0, 0, 1, x, y);
	m.concat(cm);
	return {x:m.tx, y:m.ty};
}

/**
 * Converts the (x, y) point from the display object's (local) coordinates to the target object's coordinates.
 */
DisplayObject.prototype.localToTarget = function(x, y, target) 
{
	var p = localToGlobal(x, y);
	return target.globalToLocal(p.x, p.y);
}

/**
 * @private
 */
DisplayObject.prototype.getConcatenatedMatrix = function() 
{
	//TODO: cache the concatenated matrix to get better performance
	var mtx = new casual.Matrix();
	for (var o = this; o != null; o = o.parent)
	{
		mtx.concatTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.regX, o.regY);
		if(o instanceof casual.Stage) break;
	}	
	return mtx;
}

/**
 * @private
 */
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
 * Entry of rendering, prepare and restore context.
 * @param context The context render to
 * @param noTransform Whether do transformation or not, default is do transformation.
 * @param globalTransform Whether do global transformation or not
 * @private
 */
DisplayObject.prototype._render = function(context, noTransform, globalTransform)
{	
	if(!this.visible || this.alpha <= 0) return;
	context.save();
	if(!noTransform) this._transform(context, globalTransform);
	this.render(context);
	context.restore();
}

/**
 * The real rendering workhorse, it should be overridden by subclasses.
 */
DisplayObject.prototype.render = function(context) { };

/**
 * Evaluates the display object to see if it overlaps or intersects with the point specified by the x and y parameters.
 */
DisplayObject.prototype.hitTestPoint = function(x, y, usePixelCollision, tolerance)
{	
	if(!usePixelCollision)
	{
		var p = this.globalToLocal(x, y);
		return p.x >= 0 && p.x <= this.getCurrentWidth() && p.y >= 0 && p.y <= this.getCurrentHeight();
	}
	
	var context = DisplayObject.__hitTestContext;
	context.setTransform(1, 0, 0, 1, -x, -y);
	//render this displayobject to the hit testing context
	this._render(context, false, true);

	//default tolerance is 50
	tolerance = tolerance || DisplayObject.__hitTestTolerance;	
	var result = false;
	try
	{		
		//get image data (format:RGBA) by 1*1 rectangle, then check if it's transparent
		var data = context.getImageData(0, 0, 1, 1).data;
		//trace("hitTestPoint:", this, data[0], data[1], data[2], data[3], tolerance);
		if(data[3] > tolerance) result = true;
	}catch(e)
	{
		//do nothing, throw error?
		trace("hitTestPoint:", this, e);
	};
	
	//clear canvas and return result
	context.canvas.width = 0;
	context.canvas.width = 1;
	//context.setTransform(1, 0, 0, 1, 0, 0);
	//context.clearRect(0, 0, 1, 1);
	return result;
}

/**
 * A handler for mouse events. It only works when Stage.traceMouseTarget=true. Default is null.
 * @function
 * @param event
 */
DisplayObject.prototype.onMouseEvent = null;

/**
 * Returns the string representation of the specified DisplayObject.
 */
DisplayObject.prototype.toString = function()
{
	return NameUtil.displayObjectToString(this);
}

})();