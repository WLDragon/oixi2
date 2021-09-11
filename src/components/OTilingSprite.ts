import { Container, TilingSprite, Texture } from "pixi.js";
import { oxs } from "../core/buildComponent";

function OTilingSprite(attribute: string, texture: string): TilingSprite
function OTilingSprite(attribute: string, texture: string, slots: Container[]): TilingSprite

/**
 * 平铺精灵，可以平铺纹理，需要在attribute设置宽高eg.'#tile width=10 height=10'
 */
function OTilingSprite(a: string, b: string, c?: Container[]): TilingSprite {
  return oxs(new TilingSprite(Texture.from(b)), a, c)
}

export { OTilingSprite }