import { LocationQuery } from 'vue-router';
import { isIP } from 'is-ip';
import { isArray } from 'lodash-es';

function getMainDomain(domain: string) {
  if (isIP(domain)) {
    return domain;
  }
  return domain.split('.').reverse().splice(0, 2).reverse().join('.');
}

export function processRedirectQuery(query: LocationQuery) {
  const redirectUrl = isArray(query.redirect_url)
    ? query.redirect_url[0]
    : query.redirect_url;
  try {
    if (!redirectUrl) {
      return false;
    }
    const parsedUrl = new URL(redirectUrl);
    const directMainDomain = getMainDomain(parsedUrl.hostname);
    const selfMainDomain = getMainDomain(window.location.hostname);
    if (directMainDomain !== selfMainDomain) {
      return false;
    }
    window.location.href = redirectUrl;
    return true;
  } catch (e) {
    console.error("Can't parse redirect_url", e);
    return false;
  }
}
