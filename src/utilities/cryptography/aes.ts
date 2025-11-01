import forge, { util } from "node-forge"

// node-forge uses PKCS7 padding as default for CBC algorithm encryption

export const decryptPKCS7CBC = ({key, initializationVector, encryptedBytes }: {key: util.ByteBuffer | forge.Bytes, initializationVector: string | util.ByteStringBuffer | number[], encryptedBytes: util.ByteBuffer }): string => {
    
  const decipher = forge.cipher.createDecipher("AES-CBC", key)
    
  decipher.start({iv: initializationVector});
  decipher.update(encryptedBytes);
  decipher.finish();

  return decipher.output.data;
}
export const encryptPKCS7CBC = ({key, initializationVector, encryptionText}:  {key: util.ByteBuffer | string, initializationVector: string | util.ByteStringBuffer | number[], encryptionText: string}): util.ByteBuffer => {
  const cipher = forge.cipher.createCipher("AES-CBC", key)
  const bytes = forge.util.encodeUtf8(encryptionText);

  cipher.start({iv: initializationVector})
  cipher.update(forge.util.createBuffer(bytes));
  cipher.finish();

  const resultByteBuffer = cipher.output
  return resultByteBuffer; 
}
