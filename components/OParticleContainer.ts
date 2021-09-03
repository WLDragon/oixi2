import { ParticleContainer } from "pixi.js";
import { oxs } from "../core/buildComponent";

export function OParticleContainer(attributes: string, maxSize: number) {
  return oxs(new ParticleContainer(maxSize, { position: true }), attributes)
}