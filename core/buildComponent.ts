import { Container, ObservablePoint } from "pixi.js"

const _oixi_ = '_oixi_'
const TOUCH_EVENTS = ['tap', 'touchstart', 'touchend', 'touchmove']

class OixiData {
  /**绑定上下文为组件的事件 */
  events: string[] = null
  /**从组件层获得的子显示对象 */
  slots: Container[] = null
}

/**
 * 创建组件
 * 参数解释请参考oxs
 * @param component 
 * @param attributes 
 * @param template 
 */
export function ox<T extends Container>(component: T, attributes?: string, template?: () => Container[]): T {
  return oxs(component, attributes, null, template)
}

/*
 * 模板参数：#child1 @click=onClick x=number
 * # 组件id，对应同名成员变量，同时将id赋值到组件显示对象的name属性上
 * @ 事件，事件处理函数的this绑定组件实例
 * 不带前缀的表示直接设置显示对象的属性，值类型是数字，一般用于设置x,y
 * ObservablePoint类型属性可直接赋值，例如anchor=0.5设置anchor.x和anchor.y均为0.5
 * 也可以单独设置anchor.x=0.5
*/
/**
 * 通过传入的参数初始化组件
 * 内部组件返回pixi原生对象，例如OSprite返回Sprite对象
 * @param component 组件实例
 * @param attributes 从父组件传入的模板参数
 * @param slots 从父组件传入的子显示对象
 * @param template 定义组件显示对象列表的模板，如果设置了模板且需要传入slots，则模板中必须有#slot的对象作为slots的容器
 */
export function oxs<T extends Container>(component: T, attributes?: string, slots?: Container[], template?: () => Container[]): T {

  let oxd = new OixiData()
  component[_oixi_] = oxd

  if (template) {
    let children = template()
    addChildren(component, children)

    if (slots) {
      oxd.slots = slots
      addChildren2TemplateSlot(slots, children)
    }

    bindAttributes2Component(children, component)

  } else if (slots) {
    oxd.slots = slots
    addChildren(component, slots)
  }

  if (attributes) {
    parseAttributes(attributes, component)
  }

  return component
}

function getOixiData(component: Container): OixiData {
  return component[_oixi_] ? component[_oixi_] : null
}

function addChildren(parent: Container, children: Container[]) {
  children.forEach(c => {
    parent.addChild(c)
  })
}

function parseAttributes(arg: string, component: Container) {
  function getValue(str: String) {
    return str.substring(1)
  }

  let oxd = getOixiData(component)
  arg.split(' ').forEach(attribute => {
    if (attribute) {
      switch (attribute.charAt(0)) {
        case '#':
          component.name = getValue(attribute)
          break
        case '@':
          if (!oxd.events) { oxd.events = [] }
          oxd.events.push(getValue(attribute))
          break
        default:
          let a = attribute.split('=')
          let keys: string[] = a[0].split('.')
          let value: number = Number(a[1])
          let n = keys.length
          let o = component
          for (let i = 0; i < n; i++) {
            let k = keys[i]
            if (o && (k in o)) {
              if (i == n - 1) {
                if (o[k] instanceof ObservablePoint) {
                  o[k].set(value)
                } else {
                  o[k] = value
                }
              } else {
                o = o[k]
              }
            } else {
              throw Error(`oixi: Property ${a[0]} is not in ${component['constructor'].name}`)
            }
          }
          break
      }
    }
  })
}

function findSlotContainer(children: Container[]): Container {
  for (var i = 0, n = children.length; i < n; i++) {
    let child = children[i]
    if (child.name === 'slot') {
      return child
    } else {
      let oxd = getOixiData(child)
      if (oxd && oxd.slots) {
        let s = findSlotContainer(oxd.slots)
        if (s) {
          return s
        }
      }
    }
  }

  return null
}

function addChildren2TemplateSlot(slots: Container[], template: Container[]) {
  //从模板中查找#slot，不存在则抛出错误
  let slotContainer = findSlotContainer(template)
  if (slotContainer) {
    addChildren(slotContainer, slots)
  } else {
    throw Error('oixi: no #slot in template')
  }
}

function bindAttributes2Component(children: Container[], component: Container) {
  for (let i = 0, n = children.length; i < n; i++) {
    let child = children[i]
    let oxd = getOixiData(child)
    if (oxd) {
      //将子显示对象赋值给组件
      let name = child.name
      if (name) {
        if (name in component) {
          if (Array.isArray(component[name])) {
            component[name].push(child)
          } else {
            component[name] = child
          }
        } else if (name != 'slot') {
          console.warn('oixi: no member match ' + name)
        }
      }

      if (oxd.events) {
        applyEvents(child, oxd.events, component)
      }

      if (oxd.slots) {
        bindAttributes2Component(oxd.slots, component)
      }

      //子显示对象的OixiData使命完成，释放内存
      delete child[_oixi_]
    }
  }
}

function applyEvents(child: Container, events: string[], component: Container) {
  events.forEach(e => {
    let a = e.split('=')
    let eventName = a[0]
    let handleName = a[1]
    let handle = component[handleName]
    if (handle) {
      if (TOUCH_EVENTS.includes(eventName)) {
        child.interactive = true
      }
      child.on(eventName, handle, component)
    } else {
      throw Error(`oixi: Function ${handleName} is undefined`)
    }
  })
}