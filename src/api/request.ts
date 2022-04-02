import { apiUrl } from "./url";

const post = async (url: string, data: any) => {
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    }
  });
  return res.json();
}

const get = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    redirect: 'follow',
  });
  return res.json();
}

export const getCryptoRsa = () => {
  return get(apiUrl.crypto.rsa);
}

export const submitRegister = (form: any) => {
  return post(apiUrl.auth.register, form);
}