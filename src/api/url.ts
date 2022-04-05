const baseHost = 'http://localhost:3000';
const basePrefix = '/api';

const getFullUrl = (suffix: string) => baseHost + basePrefix + suffix;

export const apiUrl = {
  crypto: {
    rsa: getFullUrl('/crypto/rsa'),
  },
  auth: {
    register: getFullUrl('/auth/register'),
    login: getFullUrl('/auth/login'),
  },
  user: {
    self: getFullUrl('/user'),
  }
};
