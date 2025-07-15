import { describe, it, assert, expect } from "vitest";
import { generateKeyPair, sha256 } from "../../src/crypto/crypto.js";

describe("sha256", () => {
  it("should return the correct SHA-256 hash for a string", async () => {
    const result = await sha256("hello");
    // Precomputed SHA-256 for "hello"
    assert.equal(
      result,
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    );
  });

  it("should return the correct SHA-256 hash for an empty string", async () => {
    const result = await sha256("");
    // Precomputed SHA-256 for ""
    assert.equal(
      result,
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
  });

  it("should return different hashes for different inputs", async () => {
    const hash1 = await sha256("foo");
    const hash2 = await sha256("bar");
    assert.notEqual(hash1, hash2);
  });
});

describe("generateKeyPair", () => {
  it("should generate an RSA key pair with PEM encoding", async () => {
    const { publicKey, privateKey } = await generateKeyPair("rsa");
    assert.match(publicKey, /-----BEGIN PUBLIC KEY-----/);
    assert.match(privateKey, /-----BEGIN PRIVATE KEY-----/);
    assert.match(publicKey, /-----END PUBLIC KEY-----/);
    assert.match(privateKey, /-----END PRIVATE KEY-----/);
  });

  it("should generate an EC key pair with PEM encoding", async () => {
    const { publicKey, privateKey } = await generateKeyPair("ec");
    assert.match(publicKey, /-----BEGIN PUBLIC KEY-----/);
    assert.match(privateKey, /-----BEGIN PRIVATE KEY-----/);
    assert.match(publicKey, /-----END PUBLIC KEY-----/);
    assert.match(privateKey, /-----END PRIVATE KEY-----/);
  });

  it("should throw for unsupported key types", async () => {
    // @ts-expect-error unsupported key type
    await expect(() => generateKeyPair("dsa")).rejects.toThrow(/Unsupported key type/);
  });
});
