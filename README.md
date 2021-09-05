[简体中文](https://github.com/WLDragon/oixi2/blob/main/README_cn.md)

# Oixi2 -- Componentized development for PixiJs 6

## Installing

```
npm install oixi2
```
## Demo

**You need to refer to the case source code to better understand the meaning of the following expressions** [Oixi2 Demo](https://github.com/WLDragon/oixi2_demo)

## Code style

Create a `Container` and `addChild` a `Text` that with `anchor.set(.5)` and  with `text='Hello Oixi2!'`

``` ts
OContainer([
  OText('anchor=0.5', 'Hello Oixi2!')
])
```

## OXS function

The main functions are `initialize properties` and `add children`

``` ts
oxs<T>(target: T, attributes?: string, slots?: Container[], template?: () => Container[]): T
```

- target: The display object instance that needs to be initialized

- attributes: String template for initializing properties, separated by spaces

> The attribute at the beginning of `#` means to set `name=*` and assign it to the member of the ancestor container with the same name

> The attribute at the beginning of `@` means to listen to event, and the event handle function has been bound to the ancestor container as this

> Other attributes means the attribute value of the target object to be set (only members of type `number` or `ObservablePoint` can be set)

``` ts
oxs(new Sprite, '#foo @tap=onTap anchor=0.5 position.x=0 x=0')
```

Parsed as follows, parent may be any ancestor container

``` ts
target.name = 'foo'
target.on('tap', parent.onTap)
target.anchor.set(0.5)
target.position.x = 0
target.x = 0

//Need to be defined in parent
foo:Sprite = null
onTap() {}
```

- slots: The list of children dynamically added to the target. If the component uses the template, the children will be `addChild` to the object(`#slot`) which specified in the template

- template: A list of preset children in the component

Both slots and templates support the following forms, essentially inheriting the container's display object list

``` ts
[
  OText('#label', 'Hello!'), //内建组件
  CustomComponent(), //自定义组件
  new Sprite() //直接实例显示对象
]
```

## Recommended custom component format

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
  title: Text = null //Note that this needs to be set to null, otherwise the title attribute cannot be found during initialization

  cats: Sprite[] = [] //Use an array to contain multiple #names

  created() {
    //the component has been initialized. eg. this.title...
    return this
  }
}
```

Reference in other components

``` ts
//OtherComponent.ts
import { Component } from './Component'

Component('x=0 y=0')
```
