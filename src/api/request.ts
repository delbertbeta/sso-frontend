import type { Rsa } from '$typings/crypto';
import type { User } from '$typings/user';
import {
  ErrorResult,
  ErrResponse,
  OkResponse,
  SuccessResult,
} from '$typings/response';
import { apiUrl } from './url';
import { PostImageRes } from '$typings/image';
import { AppListRes, AppWithSecrets, CreateAppSecretRes } from '$typings/app';

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
};

const post = async <O, E>(url: string, data: any) => {
  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  });
  return decorateResponse<O, E>(res);
};

const patch = async <O, E>(url: string, data: any) => {
  const res = await fetch(url, {
    method: 'PATCH',
    mode: 'cors',
    redirect: 'follow',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  });
  return decorateResponse<O, E>(res);
};

const get = async <O, E>(url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    redirect: 'follow',
  });
  return decorateResponse<O, E>(res);
};

export const getCryptoRsa = () => {
  return get<OkResponse<Rsa>, ErrResponse>(apiUrl.crypto.rsa);
};

export const submitRegister = (form: any) => {
  return post<OkResponse<{}>, ErrResponse>(apiUrl.auth.register, form);
};

export const submitLogin = (form: any) => {
  return post<OkResponse<{}>, ErrResponse>(apiUrl.auth.login, form);
};

export const logout = () => {
  return post<OkResponse<{}>, ErrResponse>(apiUrl.auth.logout, {});
};

export const getSelfInfo = () => {
  return get<OkResponse<User>, ErrResponse>(apiUrl.user.self);
};

export const patchSelfInfo = (form: any) => {
  return patch<OkResponse<{}>, ErrResponse>(apiUrl.user.self, form);
};

export const postImage = (extension: string) => {
  return post<OkResponse<PostImageRes>, ErrResponse>(apiUrl.image, {
    image_type: extension,
  });
};

export const patchImage = (imageId: string) => {
  return patch<OkResponse<{}>, ErrResponse>(`${apiUrl.image}/${imageId}`, '');
};

export const getAppList = () => {
  return get<OkResponse<AppListRes>, ErrResponse>(apiUrl.application);
};

export const createApp = (form: any) => {
  return post<OkResponse<{}>, ErrResponse>(apiUrl.application, form);
};

export const patchApp = (applicationId: string, form: any) => {
  return patch<OkResponse<{}>, ErrResponse>(
    `${apiUrl.application}/${applicationId}`,
    form
  );
};

export const getSingleApp = (applicationId: string) => {
  return get<OkResponse<AppWithSecrets>, ErrResponse>(
    `${apiUrl.application}/${applicationId}`
  );
};

export const createAppSecret = (applicationId: string) => {
  return post<OkResponse<CreateAppSecretRes>, ErrResponse>(
    `${apiUrl.application}/${applicationId}/secrets`,
    {}
  );
};

export const getAppSecrets = (applicationId: string) => {
  return get<
    OkResponse<Pick<AppWithSecrets, 'application_secrets'>>,
    ErrResponse
  >(`${apiUrl.application}/${applicationId}/secrets`);
};
