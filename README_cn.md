# Oixi2 -- 让 PixiJs 6 可组件化编程的工具

## 安装

```
npm install oixi2
```
## 案例

**需要参考案例源码才能更好地理解下文表述的意思** [Oixi2 Demo](https://github.com/WLDragon/oixi2_demo)

## 代码风格

创建一个`Container`并`addChild`一个`anchor.set(.5)`和`text='Hello Oixi2!'`的`Text`

``` ts
OContainer([
  OText('anchor=0.5', 'Hello Oixi2!')
])
```

## OXS 函数

主要功能是`初始化目标的属性`和`添加子显示对象`

``` ts
oxs<T>(target: T, attributes?: string, slots?: Container[], template?: () => Container[]): T
```

- target: 需要初始化的显示对象实例

- attributes: 初始化属性的字符串模板，使用空格分隔

> `#`开头的属性表示设置`name=*`，并赋值给祖先容器的同名成员

> `@`开头的属性表示监听事件，事件的处理函数已绑定了祖先容器作为this

> 其他属性表示设置目标对象的属性值（只能设置类型为`number`或`ObservablePoint`的成员）

``` ts
oxs(new Sprite, '#foo @tap=onTap anchor=0.5 position.x=0 x=0')
```

解析如下，parent可能是任何祖先容器

``` ts
target.name = 'foo'
target.on('tap', parent.onTap)
target.anchor.set(0.5)
target.position.x = 0
target.x = 0

//parent内需要定义
foo:Sprite = null
onTap() {}
```

- slots: 动态添加到target上的子显示对象列表。如果组件使用了template参数，则子显示对象会被`addChild`到模板中指定的插槽的对象上(`#slot`)

- template: 组件内预设的子显示对象列表

slots或template都支持以下形式，本质就是继承了Container的显示对象列表

``` ts
[
  OText('#label', 'Hello!'), //内建组件
  CustomComponent(), //自定义组件
  new Sprite() //直接实例显示对象
]
```

## 推荐的自定义组件格式

``` ts
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
    //此时组件已经完成初始化。eg. this.title...
    return this
  }
}
```

在其他组件中引用

``` ts
//OtherComponent.ts
import { Component } from './Component'

Component('x=0 y=0')
```
