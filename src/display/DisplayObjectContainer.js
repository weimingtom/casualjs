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
 * Basic class which can nests display objects
 * @name DisplayObjectContainer 
 * @class
 */
var DisplayObjectContainer = function()
{	
	casual.DisplayObject.call(this);
	this.children = [];
	this.mouseChildren = true;
}
casual.inherit(DisplayObjectContainer, casual.DisplayObject);
casual.DisplayObjectContainer = DisplayObjectContainer;

DisplayObjectContainer.prototype.addChild = function(child)
{
	if(child.parent == this) return child;
	else if(child.parent) child.parent.removeChild(child);
	this.children[this.children.length] = child;
	child.parent = this;
	return child;
}

DisplayObjectContainer.prototype.addChildAt = function(child, index)
{
	if(child.parent == this) return child;
	else if (child.parent) child.parent.removeChild(child);
	this.children.splice(index, 0, child);
	child.parent = this;	
	return child;
}

DisplayObjectContainer.prototype.removeChild = function(child)
{
	return this.removeChildAt(this.children.indexOf(child));
}

DisplayObjectContainer.prototype.removeChildAt = function(index)
{
	if (index < 0 || index > this.children.length - 1) return false;
	var child = this.children[index];
	if (child != null) child.parent = null;
	this.children.splice(index, 1);
	return true;
}

DisplayObjectContainer.prototype.removeAllChildren = function()
{
	while(this.children.length > 0) this.removeChildAt(0);
}

DisplayObjectContainer.prototype.getChildByName = function(name)
{
	for(var i = 0, len = this.children.length; i < len; i++)
	{
		if(this.children[i].name == name) return this.children[i];
	}
	return null;
}

DisplayObjectContainer.prototype.getChildAt = function(index)
{
	if (index < 0 || index > this.children.length - 1) return null;
	return this.children[index];
}

DisplayObjectContainer.prototype.getChildIndex = function(child)
{
	return this.children.indexOf(child);
}

DisplayObjectContainer.prototype.contains = function(child)
{
	return this.getChildIndex(child) != -1;
}

DisplayObjectContainer.prototype.getNumChildren = function()
{
	return this.children.length;
}

DisplayObjectContainer.prototype.getObjectsUnderPoint = function(x, y, usePixelCollision, tolerance)
{
	var result = [];
	for(var i = 0, len = this.children.length; i < len; i++)
	{
		var child = this.children[i];
		if(child == null || !child.mouseEnabled) continue;
		
		if((child instanceof DisplayObjectContainer) && child.mouseChildren && child.getNumChildren() > 0)
		{			
			var arr = child.getObjectsUnderPoint(x, y, usePixelCollision, tolerance);
			if(arr && arr.length > 0) result = result.concat(arr);
		}else
		{
			if(child.hitTestPoint(x, y, usePixelCollision, tolerance)) result.push(child);
		}
	}
	return result;
}

DisplayObjectContainer.prototype.render = function(context)
{
	for(var i = 0, len = this.children.length; i < len; i++)
	{
		var child = this.children[i];
		child._render(context);
	}
}

})();