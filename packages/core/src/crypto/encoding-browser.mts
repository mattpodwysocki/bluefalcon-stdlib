export type BufferLike = string | Uint8Array | Buffer;

// Encode a string or Uint8Array to base64
export function toBase64(input: BufferLike): string {
  if (
    typeof input === "object" &&
    input != null &&
    input.constructor &&
    input.constructor.name === "Buffer"
  ) {
    throw new TypeError("Buffer is not supported in the browser environment.");
  }
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else {
    bytes = input;
  }
  // Convert bytes to base64 string
  return btoa(String.fromCharCode(...bytes));
}

// Decode a base64 string to Uint8Array or string
export function fromBase64(base64: string, asString = false): Uint8Array | string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  if (asString) {
    return new TextDecoder().decode(bytes);
  }
  return bytes;
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
