export type BufferLike = string | Uint8Array | Buffer;

// Encode a string or Uint8Array to base64 using Node.js APIs
export function toBase64(input: BufferLike): string {
  let buffer: Buffer;
  if (typeof input === "string") {
    buffer = Buffer.from(input, "utf8");
  } else {
    buffer = Buffer.from(input);
  }
  return buffer.toString("base64");
}

// Decode a base64 string to Uint8Array or string using Node.js APIs
export function fromBase64(base64: string, asString = false): Uint8Array | string {
  const buffer = Buffer.from(base64, "base64");
  if (asString) {
    return buffer.toString("utf8");
  }
  return new Uint8Array(buffer);
}

// Encode to URL-safe base64 (base64url, RFC 4648 §5)
export function toBase64Url(input: BufferLike): string {
  return toBase64(input)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Decode from URL-safe base64 (base64url, RFC 4648 §5)
export function fromBase64Url(base64url: string, asString = false): Uint8Array | string {
  // Pad with '=' to make length a multiple of 4
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return fromBase64(base64, asString);
}
