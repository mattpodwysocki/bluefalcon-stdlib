import { toBase64, fromBase64 } from "./encoding.js";

/**
 * Encode a DER Uint8Array to PEM format (browser version).
 * @param der DER-encoded data (Uint8Array)
 * @param label PEM label, e.g. "CERTIFICATE", "PRIVATE KEY"
 */
export function derToPem(der: Uint8Array, label: string): string {
  const base64 = toBase64(der);
  const lines = base64.match(/.{1,64}/g) || [];
  return [
    `-----BEGIN ${label}-----`,
    ...lines,
    `-----END ${label}-----`
  ].join("\n");
}

/**
 * Decode a PEM string to a DER Uint8Array (browser version).
 * @param pem PEM-formatted string
 */
export function pemToDer(pem: string): Uint8Array {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "");
  return fromBase64(base64) as Uint8Array;
}
