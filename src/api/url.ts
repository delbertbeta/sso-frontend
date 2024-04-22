const baseHost = API_END_POINT;
const basePrefix = '/api';

const getFullUrl = (suffix: string) => baseHost + basePrefix + suffix;

export const apiUrl = {
  crypto: {
    rsa: getFullUrl('/crypto/rsa'),
  },
  auth: {
    register: getFullUrl('/auth/register'),
    login: getFullUrl('/auth/login'),
    logout: getFullUrl('/auth/logout'),
  },
  user: {
    self: getFullUrl('/user'),
  },
  image: getFullUrl('/image'),
  application: getFullUrl('/application'),
};
