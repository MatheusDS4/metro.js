/**
 * Generates a random hexadecimal string.
 */
export function randomHex(large: boolean = false): string {
  if (large) {
    return [0, 0, 0, 0, 0].map(_ => randomHex()).join("");
  }
  return Math.floor(Math.random() * 0x7fff_ffff).toString(16);
}