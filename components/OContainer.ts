import { Container } from "pixi.js";
import { oxs } from "../core/buildComponent";

function OContainer(attribute: string): Container
function OContainer(slots: Container[]): Container
function OContainer(attribute: string, slots: Container[]): Container

function OContainer(a: any, b?: any): Container {
  let c = new Container()
  if (b) {
    oxs(c, a, b)
  } else {
    if (typeof a === 'string') {
      oxs(c, a)
    } else {
      oxs(c, null, a)
    }
  }

  return c
}

export { OContainer }