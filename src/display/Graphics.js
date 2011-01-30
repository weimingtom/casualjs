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
 * Graphics
 * @name Graphics
 * @class
 */ 
var Graphics = function()
{
	this.name = NameUtil.createUniqueName("Graphics");
	
	//initialize a working canvas to draw Graphics
	var canvas = document.createElement("canvas");
	canvas.width = 1000;
	canvas.height = 1000;
	this._context = canvas.getContext("2d");
	
	Graphics._init(this, this._context);
}
casual.Graphics = Graphics;


Graphics.prototype._proxy = function(context, func, alias)
{	
	this[func] = function(){return context[func].apply(context, arguments) || this};
	if(alias) this[alias] = this[func];
}

Graphics._init = function(g, context)
{	
	g._proxy(context, "beginPath");
	g._proxy(context, "closePath");
	g._proxy(context, "stroke");
	g._proxy(context, "fill");
	g._proxy(context, "moveTo");
	g._proxy(context, "lineTo");
	
	g._proxy(context, "arcTo");
	g._proxy(context, "arc");
	g._proxy(context, "quadraticCurveTo", "curveTo");
	g._proxy(context, "bezierCurveTo");
	g._proxy(context, "rect");
	
	g._proxy(context, "createLinearGradient");
	g._proxy(context, "createRadialGradient");
	g._proxy(context, "createPattern");	
	
	g.fillStyle = null;
	g.strokeStyle = null;	
	g.fillAlpha = 1;
	g.lineAlpha = 1;
	g.lineWidth = 1;
}

Graphics.prototype.lineStyle = function(thickness, lineColor, alpha, lineCap, lineJoin, miterLimit)
{
	this.lineWidth = this._context.lineWidth = thickness || 1;
	this.strokeStyle = this._context.strokeStyle = lineColor || "0";
	this.lineAlpha = alpha || 1;
	if(lineCap != undefined) this._context.lineCap = lineCap;
	if(lineJoin != undefined) this._context.lineJoin = lineJoin;
	if(miterLimit != undefined) this._context.miterLimit = miterLimit;
	return this;
}

Graphics.prototype.beginLinearGradientFill = function(x0, y0, x1, y1, colors, ratios)
{
	var gradient = this.createLinearGradient(x0, y0, x1, y1);
	for (var i = 0, len = colors.length; i < len; i++)
	{
		gradient.addColorStop(ratios[i], colors[i]);
	}
	this.fillStyle = gradient;
	return this;
}

Graphics.prototype.beginRadialGradientFill = function(x0, y0, r0, x1, y1, r1, colors, ratios)
{
	var gradient = this.createRadialGradient(x0, y0, r0, x1, y1, r1);
	for (var i = 0, len = colors.length; i < len; i++)
	{
		gradient.addColorStop(ratios[i], colors[i]);
	}
	this.fillStyle = gradient;
	return this;
}

Graphics.prototype.beginBitmapFill = function(image, repetition)
{
	repetition = repetition || "";
	this.fillStyle = this.createPattern(image, repetition);
	return this;
}

Graphics.prototype.beginFill = function(fill, alpha)
{
	if(fill) 
	{
		this._context.fillStyle = fill;
		this.fillStyle = fill;
	}
	this.fillAlpha = alpha || 1;
	return this;
}

Graphics.prototype.endFill = function()
{
	if(this.strokeStyle) 
	{
		this._context.strokeStyle = this.strokeStyle;
		this._context.globalAlpha = this.lineAlpha;
		this._context.stroke();
	}
	if(this.fillStyle) 
	{
		this._context.fillStyle = this.fillStyle;
		this._context.globalAlpha = this.fillAlpha;
		this._context.fill();
	}
	return this;
}

Graphics.prototype.drawRect = function(x, y, width, height)
{
	this.beginPath();
	this.rect(x, y, width, height);
	this.closePath();
	return this;
}

Graphics.prototype.drawRoundRect = function(x, y, width, height, cornerSize)
{
	return this.drawRoundRectComplex(x, y, width, height, cornerSize, cornerSize, cornerSize, cornerSize);
}

Graphics.prototype.drawRoundRectComplex = function(x, y, width, height, cornerTL, cornerTR, cornerBR, cornerBL)
{
	this.beginPath();
	this.moveTo(x + cornerTL, y);
	this.lineTo(x + width - cornerTR, y);
	this.arc(x + width - cornerTR, y + cornerTR, cornerTR, -Math.PI/2, 0, false);
	this.lineTo(x + width, y + height - cornerBR);
	this.arc(x + width - cornerBR, y + height - cornerBR, cornerBR, 0, Math.PI/2, false);
	this.lineTo(x + cornerBL, y + height);
	this.arc(x + cornerBL, y + height - cornerBL, cornerBL, Math.PI/2, Math.PI, false);
	this.lineTo(x, y + cornerTL);
	this.arc(x + cornerTL, y + cornerTL, cornerTL, Math.PI, Math.PI*3/2, false);
	this.closePath();
	return this;
}

Graphics.prototype.drawCircle = function(x, y, radius)
{
	this.beginPath();
	this.arc(x + radius, y + radius, radius, 0, Math.PI * 2, 0);
	this.closePath();
	return this;
}

Graphics.prototype.drawEllipse = function(x, y, width, height)
{
	if(width == height) return this.drawCircle(x, y, width);
	var w = width / 2;
    var h = height / 2;
    var C = 0.5522847498307933;
    var cx = C * w;
    var cy = C * h;
    x = x + w;
    y = y + h;
    this.beginPath();
    this.moveTo(x + w, y);
    this.bezierCurveTo(x + w, y - cy, x + cx, y - h, x, y - h);
    this.bezierCurveTo(x - cx, y - h, x - w, y - cy, x - w, y);
    this.bezierCurveTo(x - w, y + cy, x - cx, y + h, x, y + h);
    this.bezierCurveTo(x + cx, y + h, x + w, y + cy, x + w, y);
    this.closePath();
    return this;
}

Graphics.prototype.get = function()
{
	return this._context.canvas;
}

Graphics.prototype.setSize = function(width, height)
{	
	this._context.save();
	if(width != undefined) this._context.canvas.width = width;
	if(height != undefined) this._context.canvas.height = height;
	this._context.restore();
	return this;
}

Graphics.prototype.clear = function()
{
	this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
	this._context.restore();
}

})();