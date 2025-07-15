import { randomUUID as v4RandomUUID } from "node:crypto";

const uuidFunction =
  typeof globalThis?.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID.bind(globalThis.crypto)
    : v4RandomUUID;

/**
 * Generated Universally Unique Identifier
 *
 * @returns RFC4122 v4 UUID.
 */
export function randomUUID(): string {
  return uuidFunction();
}
