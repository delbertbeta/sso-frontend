import { getCryptoRsa } from '$api/request';
import { LocalStorageRsa } from '$typings/crypto';
import { safeGetStorage, safeSetStorage } from './local-storage';

export async function digestSha256(content: string) {
  const msgUint8 = new TextEncoder().encode(content);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

export async function getRsaFromLocalStorage() {
  let rsaInfo = safeGetStorage<LocalStorageRsa>('rsa_info');
  if (
    rsaInfo &&
    ((new Date().getTime() / 1000) - rsaInfo.write_at) < (rsaInfo.data.expires - 60)
  ) {
    return rsaInfo;
  } else {
    let rsaRes = await getCryptoRsa();
    if (rsaRes.isErr) {
      throw rsaRes.response;
    }
    safeSetStorage<LocalStorageRsa>('rsa_info', {
      write_at: (new Date().getTime() / 1000),
      data: rsaRes.response.data,
    })
    return rsaRes.response;
  }
}
