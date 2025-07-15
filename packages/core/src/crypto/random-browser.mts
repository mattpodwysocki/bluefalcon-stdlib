/**
 * Returns a random integer value between a lower and upper bound,
 * inclusive of both bounds.
 * Note that this uses Math.random and isn't secure. If you need to use
 * this for any kind of security purpose, find a better source of random.
 * @param min - The smallest integer value allowed.
 * @param max - The largest integer value allowed.
 */
export function getRandomIntegerInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  const range = max - min + 1;
  if (range <= 0) throw new Error("Invalid range");
  const maxUint32 = 0xffffffff;
  const rand = crypto.getRandomValues(new Uint32Array(1))[0] / (maxUint32 + 1);
  return min + Math.floor(rand * range);
}
