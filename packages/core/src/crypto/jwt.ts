import { createHmac } from "node:crypto";
import { toBase64Url, fromBase64Url } from "./encoding.js";

type JwtHeader = { alg: string; typ: string };
type JwtPayload = Record<string, unknown>;

/**
 * Encode a JWT (HS256 only, async)
 */
export async function encodeJWT(
  payload: JwtPayload,
  secret: string,
  header: JwtHeader = { alg: "HS256", typ: "JWT" }
): Promise<string> {
  const headerB64 = toBase64Url(JSON.stringify(header));
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;
  const signature = await signHS256(data, secret);
  return `${data}.${signature}`;
}

/**
 * Decode a JWT (does not verify signature)
 */
export function decodeJWT(token: string): { header: JwtHeader; payload: JwtPayload; signature: string } {
  const [headerB64, payloadB64, signature] = token.split(".");
  if (!headerB64 || !payloadB64 || !signature) throw new Error("Invalid JWT format");
  const header = JSON.parse(fromBase64Url(headerB64, true) as string);
  const payload = JSON.parse(fromBase64Url(payloadB64, true) as string);
  return { header, payload, signature };
}

/**
 * Verify a JWT (HS256 only, async)
 */
export async function verifyJWT(token: string, secret: string): Promise<boolean> {
  const [headerB64, payloadB64, signature] = token.split(".");
  if (!headerB64 || !payloadB64 || !signature) return false;
  const data = `${headerB64}.${payloadB64}`;
  const expected = await signHS256(data, secret);
  return timingSafeEqual(signature, expected);
}

async function signHS256(data: string, secret: string): Promise<string> {
  // Node.js createHmac is synchronous, but we wrap for API consistency
  const hmac = createHmac("sha256", secret).update(data).digest();
  return toBase64Url(hmac);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
