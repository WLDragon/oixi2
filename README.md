# Oixi2 -- Componentized development for PixiJs

## NPM Install

```
npm install oixi2
```

目前只有typescript版本，javascript版需要自己使用源码构建

## Oixi2 vs Plain code
``` typescript
//Oixi2
OContainer('x=100 y=100', [
  OText('anchor=0.5 position=50', 'Hello Oixi2!')
])

//Plain code
let c = new Container()
c.x = 100
c.y = 100

let t = new Text('Hello Oixi2!')
t.anchor.set(0.5)
t.position.set(50)

c.addChild(t)
```

## oxs 函数

oxs函数的主要作用是`初始化目标对象属性`和`分层添加子显示对象`

下面代码中出现的component为自定义组件，详细请继续往下看**自定义组件**

- attributes: 初始化属性的字符串模板

> `#`开始的属性表示设置name=xx，并赋值给组件的同名成员

> `@`开始的属性表示监听事件，处理函数为绑定组件上下文件的组件函数成员

> 无特殊修饰符的属性表示设置目标对象的属性值，只能是number或ObservablePoint类型的成员

``` typescript
//slots或template中的代码
OSprite('#foo x=0 anchor=0.5 position.x=0 @tap=onTap')

//解析如下，target为Sprite实例
target.name = 'foo'
target.x = 0
target.anchor.set(0.5)
target.position.x = 0
target.on('tap', component.onTap)

//component内需要定义
private foo:Sprite = null
private onTap = () => {}
```

- slots: 将要添加到组件的子显示对象列表，如果组件使用了template参数，则将子显示对象`addChild`到模板中一个`name=slot`的对象上

- template: 组件内置的子显示对象列表，支持以下形式

``` typescript
[
  OText('#label', 'Hello!'),
  CustomComponent(),
  new Sprite()
]
```

## 自定义组件

更多参考请移步 [Oixi2 Demo](https://github.com/WLDragon/oixi2_demo)

``` typescript
//Component.ts
export function Component(attributes: string) {
  return ox(new XComponent, attributes, () => [
    OText('#title', 'Hello Oixi2!'),
    OContainer([
      OSprite('#cats', 'cat.png'),
      OSprite('#cats', 'cat.png')
    ])
  ]).created()
}

class XComponent extends Container {
  title: Text = null //注意这里需要设置为null，否则初始化时找不到title属性
  cats: Sprite[] = [] //使用数组包含多个相同的#name

  created() {
    //Do something after inited
  }
}

//Other.ts
import { Component } from './Component'
Component('x=0 y=0')
```