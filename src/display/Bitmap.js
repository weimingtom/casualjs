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
 * Constructor
 * @param image Image data, can be HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement
 * @param imageSlice format: [x, y, width, height, regX, regY]
 * @name Bitmap
 * @class Represent a bitmap, different from Bitmap in AS3, it can accept interaction.
 * @augments DisplayObject
 */ 
var Bitmap = function(image, imageSlice)
{	
	casual.DisplayObject.call(this);
	this.name = NameUtil.createUniqueName("Bitmap");
	
	//default is mouse disabled, but differ from Bitmap in AS3, this Bitmap can accept interaction
	this.mouseEnabled = false;
	
	//save image and image slice data
	this.image = image;	
	if(!imageSlice) this.imageSlice = [0, 0, image.width, image.height];
	else this.imageSlice = imageSlice;
	this.width = this.imageSlice[2];
	this.height = this.imageSlice[3];
	this.regX = this.imageSlice[4] || 0;
	this.regY = this.imageSlice[5] || 0;
}
casual.inherit(Bitmap, casual.DisplayObject);
casual.Bitmap = Bitmap;

Bitmap.prototype.render = function(context)
{
	context.drawImage(this.image, this.imageSlice[0], this.imageSlice[1], this.imageSlice[2], this.imageSlice[3], 0, 0, this.width, this.height);
}

})();