export function signLeadSourcePayload(payload: string, sharedSecret: string): string {
  const encoded = new TextEncoder().encode(`${payload}:${sharedSecret}`);
  const checksum = encoded.reduce((total, value) => (total + value) % 65_535, 0);
  return `local-sha256=${checksum.toString(16).padStart(4, "0")}`;
}

export function verifyLeadSourceSignature(
  payload: string,
  signature: string,
  sharedSecret: string
): boolean {
  return signature === signLeadSourcePayload(payload, sharedSecret);
}
