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

/**
 * Base of Casual Framework
 * @name casual
 * @class
 */
var casual = {};

/**
 * Like trace() in as3, for debug purpose. you can just use trace().
 */
casual.trace = function()
{
	var logs = [];
	for (var i = 0; i < arguments.length; i++) logs.push(arguments[i]);
	//output to console.log by default
	if(typeof(console) != "undefined" && typeof(console.log) == "function") console.log(logs.join(" "));
};

/**
 * Inheritance implementation for Javascript
 */
casual.inherit = function(childClass, parentClass) 
{
	var tempConstructor = function() {};
  	tempConstructor.prototype = parentClass.prototype;
  	childClass.superClass = parentClass.prototype;
  	childClass.prototype = new tempConstructor();
  	childClass.prototype.constructor = childClass;
};

/**
 * Delegation 'this' for functions
 */
casual.delegate = function(func, self, args)
{
	var context = self || window;
  	if (arguments.length > 2) 
  	{
    	var boundArgs = Array.prototype.slice.call(arguments, 2);
    	return function() 
    	{
      		var newArgs = Array.prototype.slice.call(arguments);
      		Array.prototype.unshift.apply(newArgs, boundArgs);
      		return func.apply(context, newArgs);
    	};
  	}else 
  	{
    	return function() { return func.apply(context, arguments); };
  	}
};