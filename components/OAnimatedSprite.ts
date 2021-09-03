import { AnimatedSprite, Texture } from "pixi.js";
import { oxs } from "../core/buildComponent";

export function OAnimatedSprite(attribute: string, textures: string[]): AnimatedSprite {
  let txrs = textures.map(t => Texture.from(t))
  let ants = new AnimatedSprite(txrs)
  if (attribute) {
    oxs(ants, attribute)
  }

  return ants
}