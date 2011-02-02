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
 * MovieClip
 * @name MovieClip
 * @class
 */
var MovieClip = function(frames)
{
	casual.DisplayObjectContainer.call(this);
	this.name = NameUtil.createUniqueName("MovieClip");
	
	this._frameLables = {};
	this._frames = [];
	if(frames) this.addFrame(frames);
	this.currentFrame = 1; //starts from 1
	this._pauseFrames = 0;
	this._paused = false;
}
casual.inherit(MovieClip, casual.DisplayObjectContainer);
casual.MovieClip = MovieClip;

MovieClip.prototype.addFrame = function(data)
{
	if(data[0] instanceof casual.Frame || data[0] instanceof Array) for(var i in data) this.addFrame(data[i]);
	else this.setFrame(this._frames.length + 1, data);
}

MovieClip.prototype.addFrameAt = function(data, frameNumber)
{
	this._frames.splice(frameNumber, 0, null);
	this.setFrame(frameNumber + 1, data);
}

MovieClip.prototype.setFrame = function(frameNumber, data)
{
	var frame;
	if(data instanceof casual.Frame) frame = data;
	else frame = new casual.Frame(data);
	this._frames[frameNumber - 1] = frame;
	if(frame.label) this._frameLables[frame.label] = frameNumber;
}

MovieClip.prototype.getFrameNumber = function(frameNumberOrLabel)
{
	if(typeof(frameNumberOrLabel) == "number") return frameNumberOrLabel;
	return this._frameLables[frameNumberOrLabel];
}

MovieClip.prototype.getFrame = function(frameNumberOrLabel)
{
	if(typeof(frameNumberOrLabel) == "number") return this._frames[frameNumberOrLabel - 1];
	return this._frames[this._frameLables[frameNumberOrLabel] - 1];
}

MovieClip.prototype.removeFrame = function(frameNumberOrLabel)
{
	var frame = this.getFrame(frameNumberOrLabel);
	var frameNumber = frameNumberOrLabel;
	if(frame.label)
	{
		frameNumber = this._frameLables[frame.label];
		delete this._frameLables[frame.label];
	}
	this._frames.splice(frameNumber - 1, 1);
}

MovieClip.prototype.getTotalFrames = function()
{
	return this._frames.length;
}

/**
 * Move playhead to next frame by current frame data
 */
MovieClip.prototype.nextFrame = function()
{
	var frame = this.getFrame(this.currentFrame);
	
	//pause frames
	if(frame.pauseFrames)
	{		
		if(frame.pauseFrames > this._pauseFrames) this._pauseFrames++;	
		else this._pauseFrames = 0;
	}
	
	//go to a specific frame
	if(frame.gotoFrame) 
	{
		if(this._pauseFrames == 0 || !frame.pauseFrames) 
		{
			if(typeof(frame.gotoFrame) == "number") return this.currentFrame = frame.gotoFrame;
			return this.currentFrame = this._frameLables[frame.gotoFrame];
		}
	}
	
	if(frame.pauseFrames && this._pauseFrames > 0) return this.currentFrame;
	else if(this.currentFrame >= this._frames.length) return this.currentFrame = 1;
	else return ++this.currentFrame;
}

MovieClip.prototype.play = function()
{
	this._paused = false;
}

MovieClip.prototype.stop = function()
{
	this._paused = true;
}

MovieClip.prototype.gotoAndStop = function(frameNumberOrLabel)
{
	this.currentFrame = this.getFrameNumber(frameNumberOrLabel);
	this._paused = true;
}

MovieClip.prototype.gotoAndPlay = function(frameNumberOrLabel)
{
	this.currentFrame = this.getFrameNumber(frameNumberOrLabel);
	this._paused = false;
}

MovieClip.prototype._render = function(context, noTransform, globalTransform)
{
	//prepare frame to render
	if(!this._paused) this.nextFrame();
	var frame = this.getFrame(this.currentFrame);	
	if(frame)
	{
		//set frame properties for the movieclip
		this.width = frame.width;
		this.height = frame.height;
		this.regX = frame.regX;
		this.regY = frame.regY;
		if(frame.stop) this.stop();
	}	
	MovieClip.superClass._render.call(this, context, noTransform, globalTransform);
}

MovieClip.prototype.render = function(context)
{
	//render current frame
	var frame = this.getFrame(this.currentFrame);
	frame.render(context, 0, 0);
	//render children
	MovieClip.superClass.render.call(this, context);
}

})();