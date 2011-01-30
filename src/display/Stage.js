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
 * The root of display object list.
 * @name Stage
 * @class
 */
var Stage = function(context)
{
	if(context == null) throw Error("Context can't be null!");
	casual.DisplayObjectContainer.call(this);
	this.name = NameUtil.createUniqueName("Stage");

	//@protected
	this._context = context;
	this._frameRate = 1;
	this._mouseX = 0;
	this._mouseY = 0;
	this._dragTarget = null;
	this._paused = false;
	this._pauseInNextFrame = false;
	
	//@private internal use
	this.__tempContext = null;
	this.__intervalID = null;
	
	//default frameRate is 20
	this.setFrameRate(20);
	
	//delegate mouse events on the canvas
	this._context.canvas.onmousedown = casual.delegate(this.__mouseHandler, this);
	this._context.canvas.onmouseup = casual.delegate(this.__mouseHandler, this);
	this._context.canvas.onmousemove = casual.delegate(this.__mouseHandler, this);
}
casual.inherit(Stage, casual.DisplayObjectContainer);
casual.Stage = Stage;

Stage.prototype.setPaused = function(pause, pauseInNextFrame)
{
	if(this._paused == pause) return;
	this._paused = pause;
	//sometimes we need to pause after rendering current frame
	this._pauseInNextFrame = pauseInNextFrame || false;
}

Stage.prototype.getPaused = function()
{
	return this._paused;
}

Stage.prototype.setFrameRate = function(frameRate)
{
	if(this._frameRate == frameRate) return;
	this._frameRate = frameRate;
	if(this.__intervalID != null) clearInterval(this.__intervalID);
	this.__intervalID = setInterval(casual.delegate(this.__enterFrame, this), 1000/this._frameRate);
}

Stage.prototype.__mouseHandler = function(event)
{
	this._mouseX = event.pageX - this._context.canvas.offsetLeft;
	this._mouseY = event.pageY - this._context.canvas.offsetTop;
	
	var e = casual.EventBase.clone(event, casual.StageEvent);
	e.target = e.currentTarget = this;
	e.stageX = this._mouseX;
	e.stageY = this._mouseY;
	this.dispatchEvent(e);
	
	//disable text selection on the canvas, works like a charm.	
	event.preventDefault();
  	event.stopPropagation();
}

Stage.prototype.__enterFrame = function()
{
	if(this._paused && !this._pauseInNextFrame) return;
	this.dispatchEvent(new StageEvent(StageEvent.ENTER_FRAME));
	//check if paused once more, because it may be changed in ENTER_FRAME handler
	if(!this._paused || this._pauseInNextFrame) this._render(this._context, true);
	if(this._frameRate == 0) clearInterval(this.__intervalID);
}

/**
 * Each render called, the stage will render the entire display list to canvas.
 */
Stage.prototype.render = function(context)
{	
	this.clear();
	if(this._dragTarget)
	{
		//handle drag target
		var p = this._dragTarget.globalToLocal(this._mouseX, this._mouseY);
		this._dragTarget.x = p.x;
		this._dragTarget.y = p.y;
	}
	Stage.superClass.render.call(this, context);
	
	if(this._pauseInNextFrame)
	{
		this._paused = true;
		this._pauseInNextFrame = false;
	}
}

Stage.prototype.__getTempContext = function()
{
	var tempCanvas;
	if(this.__tempContext == null) 
	{
		tempCanvas = document.createElement("canvas");
		this.__tempContext = tempCanvas.getContext("2d");
	}else
	{
		tempCanvas = this.__tempContext.canvas;		
	}
	//keep temp canvas's size same as its context
	tempCanvas.width = this._context.canvas.width;
	tempCanvas.height = this._context.canvas.height;
	return this.__tempContext;
}

Stage.prototype.startDrag = function(target, bounds)
{
	this._dragTarget = target;
	//this._context.canvas.style.cursor = "pointer";
	//this._bounds = bounds; //TODO: restrict dragging bound
}

Stage.prototype.stopDrag = function()
{
	this._dragTarget = null;
	//this._context.canvas.style.cursor = "";
}

/**
 * Clear the canvas by specific rectangle, if not set, clear the whole canvas
 */
Stage.prototype.clear = function(x, y, width, height)
{
	if(arguments.length >= 4) this._context.clearRect(x, y, width, height);
	else this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
}

Stage.prototype.getMouseX = function()
{
	return this._mouseX;
}

Stage.prototype.getMouseY = function()
{
	return this._mouseY;
}

Stage.prototype.getStageWidth = function()
{
	return this._context.canvas.width;
}

Stage.prototype.getStageHeight = function()
{
	return this._context.canvas.height;
}

Stage.prototype.getFrameRate = function()
{
	return this._frameRate;
}

Stage.prototype.getContext = function()
{
	return this._context;
}

Stage.prototype.getCanvas = function()
{
	return this._context.canvas;
}

})();