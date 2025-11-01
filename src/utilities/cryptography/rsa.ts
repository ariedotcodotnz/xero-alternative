import forge from "node-forge"

export function encryptRSAOAEP(message: string, publicKey: forge.pki.rsa.PublicKey): string {
  const encrypted = publicKey.encrypt(forge.util.encodeUtf8(message), "RSA-OAEP", {
    md: forge.md.sha512.create(),
    mgf1: forge.mgf.mgf1.create(forge.md.sha512),
  });

  return forge.util.encode64(encrypted);
}

export function decryptRSAOAEP(encryptedMessage: string, privateKey: forge.pki.rsa.PrivateKey): string {
  const decrypted = privateKey.decrypt(encryptedMessage, "RSA-OAEP", {
    md: forge.md.sha512.create(),
    mgf1: forge.mgf.mgf1.create(forge.md.sha512),
  });

  return decrypted;
}
