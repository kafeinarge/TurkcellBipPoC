const iv = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

export const hex2Arr = str => {
  if (!str) {
    return new Uint8Array();
  }
  const arr = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    arr.push(parseInt(str.substr(i, 2), 16));
  }
  return new Uint8Array(arr);
};

export const buf2Hex = buf => {
  return Array.from(new Uint8Array(buf))
    .map(x => ('00' + x.toString(16)).slice(-2))
    .join('');
};

export function getMessageEncoding(message) {
  const enc = new TextEncoder();
  return enc.encode(message);
}

export function getMessageDecoding(decrypted) {
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

export async function encrypt(secretKey, message) {
  try {
    const encoded = getMessageEncoding(message);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      secretKey,
      encoded,
    );

    // const buffer = new Uint8Array(ciphertext, 0, 5);
    // return buffer;
    return ciphertext;
  } catch (e) {
    console.log(e);
  }
}

export async function decrypt(secretKey, ciphertext) {
  try {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      secretKey,
      ciphertext,
    );

    return getMessageDecoding(decrypted);
  } catch (e) {
    console.log(e);
  }
}

export async function deriveSecretKey(privateKey, publicKey) {
  return await window.crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey,
    },
    privateKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function generateKey() {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-384',
      },
      true,
      ['deriveKey'],
    );
    return keyPair;
  } catch (error) {
    console.log(error);
  }
}

export async function exportKey(keyData) {
  try {
    const exported = await window.crypto.subtle.exportKey('jwk', keyData);
    return exported;
  } catch (e) {
    console.log(e);
  }
}

export async function importPrivateKey(keyData) {
  try {
    const key = await window.crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'ECDH',
        namedCurve: 'P-384', //can be "P-256", "P-384", or "P-521"
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ['deriveKey'], //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
    );

    return key;
  } catch (e) {
    console.log(e);
  }
}

export async function importPublicKey(keyData) {
  try {
    const key = await window.crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'ECDH',
        namedCurve: 'P-384',
      },
      true,
      [],
    );

    return key;
  } catch (e) {
    console.log(e);
  }
}

export function stringify(key) {
  return JSON.stringify(key, null, ' ');
}

export function parse(stringfyData) {
  return JSON.parse(stringfyData, null);
}
