import assert from 'node:assert/strict';
import { getLoginRedirectQuery } from '../src/utils/url';

const redirectUrl = 'https://brando-staging.delbertbeta.life/';
const query = getLoginRedirectQuery({
  redirect_url: redirectUrl,
});

assert.deepEqual(query, {
  redirect_url: redirectUrl,
});
