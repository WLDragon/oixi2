import { ITextStyle, Text } from "pixi.js";
import { oxs } from "../core/buildComponent";

let textDefaultStyle: Object = {}

/**
 * 设置全局默认样式
 * @param style 样式对象
 */
export function setTextDefaultStyle(style: Partial<ITextStyle>) {
  textDefaultStyle = style
}

function OText(attribute: string): Text
function OText(attribute: string, text: string): Text
function OText(attribute: string, style: Partial<ITextStyle>): Text
function OText(attribute: string, text: string, style: Partial<ITextStyle>): Text

function OText(a: string, b?: any, c?: Partial<ITextStyle>): Text {
  let style: Partial<ITextStyle> = textDefaultStyle
  let txt: string = ''
  if (c) {
    txt = b
    style = Object.assign({}, textDefaultStyle, c)
  } else if (b) {
    if (typeof b === 'string') {
      txt = b
    } else {
      style = Object.assign({}, textDefaultStyle, b)
    }
  }
  return oxs(new Text(txt, style), a)
}

export { OText }