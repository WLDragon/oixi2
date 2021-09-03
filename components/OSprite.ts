import { Container, Sprite, Texture } from "pixi.js";
import { oxs } from "../core/buildComponent";

function OSprite(attribute: string): Sprite
function OSprite(attribute: string, texture: string): Sprite
function OSprite(attribute: string, slots: Container[]): Sprite
function OSprite(attribute: string, texture: string, slots: Container[]): Sprite

/**
 * 精灵，可以渲染纹理的容器
 */
function OSprite(a: string, b?: any, c?: Container[]): Sprite {
  let texture: Texture
  let slots: Container[] = null
  if (c) {
    slots = c
    texture = Texture.from(b)
  } else if (b) {
    if (typeof b === 'string') {
      texture = Texture.from(b)
    } else {
      slots = b
    }
  }
  let s = texture ? new Sprite(texture) : new Sprite
  return oxs(s, a, slots)
}

export { OSprite }