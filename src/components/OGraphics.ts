import { Graphics } from "pixi.js";
import { oxs } from "../core/buildComponent";

export function OGraphics(attribute?: string): Graphics {
  return oxs(new Graphics(), attribute)
}