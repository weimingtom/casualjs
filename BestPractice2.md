## 显示对象容器DisplayObjectContainer的使用 ##

在casualjs中通过DisplayObjectContainer，Sprite等可以很容易的实现各种元素的分组嵌套及布局。比如：

```
var container = new Sprite();
container.addChild(bmp1);
container.addChild(mc1);
container.addChild(text1);
...
stage.addChild(container);

var anotherContainer = new Sprite();
anotherContainer.addChild(sprite2);
anotherContainer.addChild(shape2);
...
stage.addChild(anotherContainer);
```

但是一定要控制容器的嵌套层级数，如果有个按钮，它的N次父容器才是stage的话，那会降低应用的效率。请尽量扁平化管理你的容器，也就是说尽量确保任何一个可视元素只需要上溯1-5级即可到达stage。