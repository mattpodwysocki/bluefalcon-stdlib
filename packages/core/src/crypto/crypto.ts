import { createHash, generateKeyPair as nodeGenerateKeyPair } from "node:crypto";
import { promisify } from "node:util";

const generateKeyPairAsync = promisify(nodeGenerateKeyPair);

export async function sha256(input: string): Promise<string> {
  const hash = createHash("sha256").update(input, "utf8").digest("hex");
  return hash;
}

/**
 * Generate an RSA or EC key pair asynchronously.
 * @param type "rsa" or "ec"
 * @param options Options for key generation (see Node.js crypto docs)
 * @returns { publicKey: string, privateKey: string }
 */
export async function generateKeyPair(
  type: "rsa" | "ec",
  options?: Record<string, unknown>
): Promise<{ publicKey: string; privateKey: string }> {
  if (type === "rsa") {
    const { publicKey, privateKey } = await generateKeyPairAsync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      ...(options ?? {}),
    });
    return { publicKey, privateKey };
  } else if (type === "ec") {
    const { publicKey, privateKey } = await generateKeyPairAsync("ec", {
      namedCurve: "P-256",
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      ...(options ?? {}),
    });
    return { publicKey, privateKey };
  } else {
    throw new Error("Unsupported key type. Use 'rsa' or 'ec'.");
  }
}
