// modules/Careers/utils/cryptoHelper.js
import { ABRIDH_PUBLIC_KEY_PEM } from "../data/careersData";

function pemToArrayBuffer(pem) {
  const b64Lines = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const binaryString = window.atob(b64Lines);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Encrypts the candidate data payload using native browser Web Crypto API:
 * 1. Generates an ephemeral AES-256-GCM symmetric key.
 * 2. Encrypts data with AES-256-GCM.
 * 3. Encrypts the AES key with Server RSA Public Key (RSA-OAEP SHA-256).
 */
export async function encryptCandidatePayload(payload) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto API is not supported on this browser.");
  }

  // 1. Import Server Public RSA Key
  const rsaKeyBuffer = pemToArrayBuffer(ABRIDH_PUBLIC_KEY_PEM);
  const rsaPublicKey = await window.crypto.subtle.importKey(
    "spki",
    rsaKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  // 2. Generate random 256-bit AES key
  const aesKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  // 3. Generate random 12-byte IV for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 4. Encrypt JSON payload with AES-GCM
  const encodedData = new TextEncoder().encode(JSON.stringify(payload));
  const encryptedContentBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv, tagLength: 128 },
    aesKey,
    encodedData
  );

  // Web Crypto appends authTag to the end of ciphertext
  const tagLengthBytes = 16;
  const ciphertextBytes = encryptedContentBuffer.slice(0, encryptedContentBuffer.byteLength - tagLengthBytes);
  const authTagBytes = encryptedContentBuffer.slice(encryptedContentBuffer.byteLength - tagLengthBytes);

  // 5. Export raw AES key and encrypt with RSA public key
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    rsaPublicKey,
    rawAesKey
  );

  // 6. Return envelope
  return {
    encryptedKey: arrayBufferToBase64(encryptedKeyBuffer),
    iv: arrayBufferToBase64(iv),
    ciphertext: arrayBufferToBase64(ciphertextBytes),
    authTag: arrayBufferToBase64(authTagBytes),
  };
}