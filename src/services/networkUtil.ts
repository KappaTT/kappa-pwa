import { buildUrl, jsonRequest } from './Networking';
import { customFetch } from './Request';
import { setItem } from './secureStorage';
import { log } from './logService';

export const LOGIN_ENDPOINT = 'api/v1/login';
export const GRAPHQL_ENDPOINT = 'api/v1/graphql';

export let token = '';
export let address = '';

export const setToken = async (newToken: string, fromStorage?: boolean) => {
  token = newToken;

  if (fromStorage) {
    return;
  }

  return setItem('token', token);
};

export const setAddress = async (newAddress: string, fromStorage?: boolean) => {
  address = newAddress;

  if (fromStorage) {
    return;
  }

  return setItem('address', address);
};

export const customAuthorizedFetch = async (uri: string, options: any) => {
  options.headers = {
    ...options.headers,
    Authorization: token !== '' ? `Bearer ${token}` : ''
  };

  const builtUri = buildUrl(address, undefined, GRAPHQL_ENDPOINT, true);

  log('Requesting via GQL', builtUri);

  return customFetch(builtUri, options);
};
