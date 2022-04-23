import COS from 'cos-js-sdk-v5';

import { CosToken } from '$typings/image';

let cosToken: CosToken | null = null;

export function getCosToken() {
  return cosToken;
}

export function setCosToken(token: CosToken) {
  cosToken = token;
}

export const cos = new COS({
  getAuthorization: async (_options, callback) => {
    if (!cosToken) throw 'No cosToken was set';

    callback({
      TmpSecretId: cosToken.tmp_secret_id,
      TmpSecretKey: cosToken.tmp_secret_key,
      SecurityToken: cosToken.session_token,
      StartTime: cosToken.start_time,
      ExpiredTime: cosToken.expired_time,
      ScopeLimit: true,
    });
  }
});
