import { derToPem } from "./pem.js";

export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generate an RSA or EC key pair using the Web Crypto API.
 * @param type "rsa" or "ec"
 * @param options Optional overrides for key generation parameters
 * @returns { publicKey: string, privateKey: string }
 */
export async function generateKeyPair(
  type: "rsa" | "ec",
  options?: Record<string, unknown>
): Promise<{ publicKey: string; privateKey: string }> {
  if (type === "rsa") {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
        ...(options ?? {}),
      },
      true,
      ["sign", "verify"]
    );
    const result = keyPair as CryptoKeyPair;
    return {
      publicKey: await exportKeyToBase64(result.publicKey, "public"),
      privateKey: await exportKeyToBase64(result.privateKey, "private"),
    };
  } else if (type === "ec") {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
        ...(options ?? {}),
      },
      true,
      ["sign", "verify"]
    );
    const result = keyPair as CryptoKeyPair;
    return {
      publicKey: await exportKeyToBase64(result.publicKey, "public"),
      privateKey: await exportKeyToBase64(result.privateKey, "private"),
    };
  } else {
    throw new Error("Unsupported key type. Use 'rsa' or 'ec'.");
  }
}

async function exportKeyToBase64(key: CryptoKey, type: "public" | "private"): Promise<string> {
  const format = type === "public" ? "spki" : "pkcs8";
  const exported = await crypto.subtle.exportKey(format, key);
  // Convert ArrayBuffer to base64
  const bytes = new Uint8Array(exported);
  return derToPem(bytes, type === "public" ? "PUBLIC KEY" : "PRIVATE KEY");
}
