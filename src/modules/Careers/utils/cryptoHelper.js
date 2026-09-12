// modules/Careers/utils/cryptoHelper.js
import { ABRIDH_PUBLIC_KEY_PEM } from "../data/careersData";

function pemToArrayBuffer(pem) {
  if (!pem || typeof pem !== "string") {
    throw new Error("ABRIDH_PUBLIC_KEY_PEM is empty or not a string.");
  }
  const cleanB64 = pem
    .replace(/-----BEGIN [A-Z0-9_-]+ PUBLIC KEY-----/gi, "")
    .replace(/-----END [A-Z0-9_-]+ PUBLIC KEY-----/gi, "")
    .replace(/[\r\n\s]+/g, "");

  const binaryString = window.atob(cleanB64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export async function encryptCandidatePayload(payload) {
  if (!window.crypto || !window.crypto.subtle) {
    console.warn("[Crypto] Web Crypto not available; sending raw payload.");
    return null;
  }

  try {
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

    const aesKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(payload));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv, tagLength: 128 },
      aesKey,
      encodedData
    );

    const tagLengthBytes = 16;
    const ciphertextBytes = encryptedBuffer.slice(0, encryptedBuffer.byteLength - tagLengthBytes);
    const authTagBytes = encryptedBuffer.slice(encryptedBuffer.byteLength - tagLengthBytes);

    const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
    const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      rsaPublicKey,
      rawAesKey
    );

    return {
      encryptedKey: arrayBufferToBase64(encryptedKeyBuffer),
      iv: arrayBufferToBase64(iv),
      ciphertext: arrayBufferToBase64(ciphertextBytes),
      authTag: arrayBufferToBase64(authTagBytes),
    };
  } catch (err) {
    console.error("[Crypto Error Details]:", err);
    throw new Error(`Encryption failed: ${err.message}`);
  }
}