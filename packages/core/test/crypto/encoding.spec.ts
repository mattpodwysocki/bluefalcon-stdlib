import { describe, it, assert } from "vitest";
import {
  toBase64,
  fromBase64,
  toBase64Url,
  fromBase64Url,
} from "../../src/crypto/encoding.js";

describe("encoding", () => {
  it("toBase64 and fromBase64 with string", () => {
    const str = "hello world";
    const b64 = toBase64(str);
    assert.equal(b64, "aGVsbG8gd29ybGQ=");
    const decoded = fromBase64(b64, true);
    assert.equal(decoded, str);
  });

  it("toBase64 and fromBase64 with Uint8Array", () => {
    const arr = new Uint8Array([104, 101, 108, 108, 111]);
    const b64 = toBase64(arr);
    assert.equal(b64, "aGVsbG8=");
    const decoded = fromBase64(b64);
    assert.deepEqual(decoded, arr);
  });

  it("toBase64Url and fromBase64Url with string", () => {
    const str = "foo+bar/baz=";
    const b64url = toBase64Url(str);
    assert.equal(b64url, "Zm9vK2Jhci9iYXo9");
    const decoded = fromBase64Url(b64url, true);
    assert.equal(decoded, str);
  });

  it("toBase64Url and fromBase64Url with Uint8Array", () => {
    const arr = new Uint8Array([255, 254, 253, 252]);
    const b64url = toBase64Url(arr);
    assert.equal(b64url, "__79_A");
    const decoded = fromBase64Url(b64url);
    assert.deepEqual(decoded, arr);
  });

  it("fromBase64 returns Uint8Array by default", () => {
    const b64 = "aGVsbG8=";
    const result = fromBase64(b64);
    assert.instanceOf(result, Uint8Array);
    assert.deepEqual(Array.from(result as Uint8Array), [104, 101, 108, 108, 111]);
  });

  it("fromBase64Url returns Uint8Array by default", () => {
    const b64url = "aGVsbG8";
    const result = fromBase64Url(b64url);
    assert.instanceOf(result, Uint8Array);
    assert.deepEqual(Array.from(result as Uint8Array), [104, 101, 108, 108, 111]);
  });
});
