import { randomInt } from "node:crypto";

export function getRandomIntegerInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  const range = max - min + 1;
  if (range <= 0) throw new Error("Invalid range");
  return randomInt(min, max + 1);
}
