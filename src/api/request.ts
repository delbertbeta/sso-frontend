import { Rsa } from '$typings/crypto';
import { ErrorResult, ErrResponse, OkResponse, SuccessResult } from '$typings/response';
import { apiUrl } from './url';

const decorateResponse = async <O, E>(res: Response) => {
  const resObj = await res.json();
  if (resObj.code === 0) {
    return {
      response: resObj as O,
      isErr: false,
    } as SuccessResult<O>;
  } else {
    return {
      response: resObj as E,
      isErr: true,
    } as ErrorResult<E>;
  }
}

const post = async <O, E>(url: string, data: any) => {
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    }
  });
  return decorateResponse<O, E>(res);
}

const get = async <O, E>(url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    redirect: 'follow',
  });
  return decorateResponse<O, E>(res);
}

export const getCryptoRsa = () => {
  return get<OkResponse<Rsa>, ErrResponse>(apiUrl.crypto.rsa);
}

export const submitRegister = (form: any) => {
  return post<OkResponse<{}>, ErrResponse>(apiUrl.auth.register, form);
}

export const submitLogin = (form: any) => {
  return post<OkResponse<{}>, ErrResponse>(apiUrl.auth.login, form);
}
