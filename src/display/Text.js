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
 * Text
 * name Text
 * @class
 */
var Text = function(text, color, font)
{
	casual.DisplayObject.call(this);
	this.name = NameUtil.createUniqueName("Text");
	
	this.text = text;
	this.color = color || "#000";
	this.font = font || "12px Arial";
	this.textAlign = "start";
	this.textBaseline = "alphabetic";
	this.maxWidth = null;
	this.outline = false;
	
}
casual.inherit(Text, casual.DisplayObject);
casual.Text = Text;

Text.prototype.render = function(context)
{
	if(!this.text || this.text.length == 0) return;
	
	if(this.outline) context.strokeStyle = this.color;
	else context.fillStyle = this.color;
	context.font = this.font;
	context.textAlign = this.textAlign;
	context.textBaseline = this.textBaseline;
	if(this.outline) context.strokeText(this.text, 0, 0, this.maxWidth);
	else context.fillText(this.text, 0, 0, this.maxWidth);
}

Text.prototype.getWidth = function(context)
{
	if(!this.text || this.text.length == 0) return 0;
	return context.measureText(this.text).width;
}
	
})();