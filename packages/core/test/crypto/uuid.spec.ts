import { test, assert } from "vitest";
import { randomUUID } from "../../src/crypto/uuid.js";

function isUUIDv4(str: string): boolean {
  // RFC4122 v4 UUID regex
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

test("randomUUID returns a string", () => {
  const uuid = randomUUID();
  assert.typeOf(uuid, "string");
});

test("randomUUID returns a valid v4 UUID", () => {
  const uuid = randomUUID();
  assert.ok(isUUIDv4(uuid), `UUID ${uuid} is not a valid v4 UUID`);
});

test("randomUUID returns unique values", () => {
  const uuids = new Set<string>();
  for (let i = 0; i < 100; i++) {
    uuids.add(randomUUID());
  }
  assert.strictEqual(uuids.size, 100, "UUIDs are not unique");
});
