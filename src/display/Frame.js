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
 * Represent a frame for a MovieClip.
 * @name Frame
 * @class
 */
var Frame = function(data)
{
	this.setData(data);	
}
casual.Frame = Frame;

/**
 * Set data for the frame.
 * @param data [image, label, x, y, width, height, regX, regY, gotoFrame, pauseFrames, stop]
 */
Frame.prototype.setData = function(data)
{
	if(!data) return;
	var arr = data.slice(0);
	
	if(typeof(arr[0]) == "object") this.image = arr.shift();
	if(typeof(arr[0]) == "string") this.label = arr.shift();

	this.x = arr[0] || 0; //x coordinate within the image
	this.y = arr[1] || 0; //y cooridmate within the image
	this.width = arr[2] || 0; //frame image slice width
	this.height = arr[3] || 0; //frame image slice height
	this.regX = arr[4] || 0; //x registration point
	this.regY = arr[5] || 0; //y registration point
	this.gotoFrame = arr[6] || 0; //can be either frameNumber or frameLabel
	this.pauseFrames = arr[7] || 0; //number of frames to pause
	this.stop = arr[8] || 0; //whether stop when play to this frame
}

/**
 * Simple render interface without any transformation
 */
Frame.prototype.render = function(context, x, y, width, height)
{
	context.drawImage(this.image, this.x, this.y, this.width, this.height, x, y, width || this.width, height || this.height);
}

/**
 * Frame factory
 */
Frame.create = function(image, data)
{
	//group of frames
	if(data[0] instanceof Array)
	{		
		var frames = [];
		for(var i = 0, len = data.length; i < len; i++)
		{
			var frame = new Frame(data[i]);
			frame.image = image;
			frames[i] = frame;
		}
		return frames;
	}
	
	//single frame
	var frame = new Frame(data);
	frame.image = image;
	return frame;
}
 
})();
 