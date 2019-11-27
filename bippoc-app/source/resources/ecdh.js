import { Alert, AsyncStorage } from 'react-native';
import AesCrypto from 'react-native-aes-pack';

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

const ivVector = new Uint8Array([
  186,
  57,
  45,
  243,
  230,
  215,
  40,
  186,
  153,
  89,
  129,
  216,
  131,
  135,
  249,
  60,
]);

export const generateKeys = () => {
  // generate user's private and public key
  return window.crypto.subtle
    .generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true, // no need to make user's private key exportable
      ['deriveKey', 'deriveBits'],
    )
    .then(async keyPair => {
      // const publicKey = await window.crypto.subtle.exportKey('raw', keyPair.publicKey);
      // console.log(publicKey);
      // const privateKey = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
      // console.log(privateKey);

      // const secret = await window.crypto.subtle.deriveKey(
      //   {
      //     name: 'ECDH',
      //     namedCurve: 'P-256',
      //     public: keyPair.publicKey,
      //   },
      //   keyPair.privateKey,
      //   {
      //     name: 'AES-CBC',
      //     length: 256,
      //   },
      //   false,
      //   ['encrypt', 'decrypt'],
      // );

      let alicesKeyPair = await window.crypto.subtle.generateKey(
        {
          name: 'ECDH',
          namedCurve: 'P-384',
        },
        false,
        ['deriveKey'],
      );

      let bobsKeyPair = await window.crypto.subtle.generateKey(
        {
          name: 'ECDH',
          namedCurve: 'P-384',
        },
        false,
        ['deriveKey'],
      );

      let alicesSecretKey = await deriveSecretKey(alicesKeyPair.privateKey, bobsKeyPair.publicKey);
      let bobsSecretKey = await deriveSecretKey(bobsKeyPair.privateKey, alicesKeyPair.publicKey);

      // const secret = await deriveSecretKey(keyPair.privateKey, keyPair.publicKey);

      const encrypted = await encrypt(alicesSecretKey, 'testtt');
      console.log(encrypted);

      const dencrypted = await decrypt(bobsSecretKey, encrypted);
      console.log(dencrypted);

      console.log(buf2Hex(dencrypted));

      // await AsyncStorage.setItem('test', JSON.stringify(privateKey));
      // const t = await AsyncStorage.getItem('test');
      // console.log(JSON.parse(t));
      // await window.crypto.subtle.importKey(
      //   'jwk',
      //   keyPair.privateKey,
      //   {
      //     name: 'ECDH',
      //     namedCurve: 'P-256',
      //   },
      //   true, // no need to make user's private key exportable
      //   ['deriveKey', 'deriveBits'],
      // );

      // return window.crypto.subtle.exportKey('raw', keyPair.publicKey);
      return null;
    })
    .catch(err => {
      console.log(err);

      Alert.alert(JSON.stringify(err));
    });
};

async function encrypt({ secretKey, decrypted }) {
  iv = await window.crypto.getRandomValues(new Uint8Array(12));
  let encoded = getMessageEncoding(decrypted);

  ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    secretKey,
    encoded,
  );

  let buffer = new Uint8Array(ciphertext, 0, 5);
  return buffer;
}

function getMessageEncoding(message) {
  let enc = new TextEncoder();
  return enc.encode(message);
}

async function decrypt(secretKey, ciphertext) {
  try {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      secretKey,
      ciphertext,
    );

    let dec = new TextDecoder();

    return dec.decode(decrypted);
  } catch (e) {
    // decryptedValue.classList.add('error');
    // decryptedValue.textContent = '*** Decryption error ***';
  }
}

async function deriveSecretKey(privateKey, publicKey) {
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
