import Constants from 'expo-constants';

const manifest = Constants.manifest;

import { jsonRequest, jsonAuthorizedRequest } from '@services/Networking';
import { setItem } from '@services/secureStorage';
import { jsonMockRequest } from '@services/mockService';
import { log } from '@services/logService';

export const M_GET = 'GET';
export const M_POST = 'POST';
export const M_PUT = 'PUT';
export const M_PATCH = 'PATCH';
export const M_DELETE = 'DELETE';
export type TMethod = typeof M_GET | typeof M_POST | typeof M_PUT | typeof M_PATCH | typeof M_DELETE;

export const BASE_URL = 'https://jerde7y95m.execute-api.us-east-1.amazonaws.com/dev/';
export const BASE_URL_DEV = 'http://localhost:3000/dev/';

export const BASE_URL_MOCKING = true;

export const BASE_URL_IP =
  typeof manifest.packagerOpts === 'object' && manifest.packagerOpts.dev
    ? manifest.debuggerHost.indexOf('127.0.0.1') >= 0
      ? `http://${manifest.debuggerHost.split(':').shift()}:3000/dev/`
      : `http://${manifest.debuggerHost.split(':').shift()}:3000/dev/` // replace with ngrok if necessary
    : BASE_URL;

log('Built base url', BASE_URL_IP);

export const ENDPOINTS: {
  [key: string]: (config?: any) => string;
} = {
  SIGN_IN: () => 'users/login',
  UPDATE_USER: (config: any) => `users/${encodeURIComponent(config.email)}`,
  GET_EVENTS: () => 'events'
};

export const METHODS: {
  [key: string]: TMethod;
} = {
  SIGN_IN: M_POST,
  UPDATE_USER: M_PATCH,
  GET_EVENTS: M_GET
};

export interface TResponseData {
  success: boolean;
  error?: {
    message?: string;
    blame?: TBlame;
  };
}

export interface TResponse {
  success: boolean;
  code?: number;
  data?: any;
  error?: any;
}

export interface TFlatBlame {
  [key: string]: string;
}

export interface TBlame {
  [key: string]: TFlatBlame;
}

export const makeRequest = async <T>(
  endpoint: string,
  method: TMethod,
  params: {
    queryParams?: any;
    headers?: any;
    body?: any;
  }
) => {
  if (BASE_URL_MOCKING) {
    return jsonMockRequest<T>(endpoint, method);
  }

  return jsonRequest<T>(
    BASE_URL_IP,
    undefined,
    endpoint,
    true,
    method,
    params.headers,
    params.queryParams,
    params.body
  );
};

export const makeAuthorizedRequest = async <T>(
  endpoint: string,
  method: TMethod,
  params: {
    queryParams?: any;
    headers?: any;
    body?: any;
  },
  token: string
) => {
  if (BASE_URL_MOCKING) {
    return jsonMockRequest<T>(endpoint, method);
  }

  return jsonAuthorizedRequest<T>(
    BASE_URL_IP,
    undefined,
    endpoint,
    true,
    token,
    method,
    params.headers,
    params.queryParams,
    params.body
  );
};

export const flattenBlame = (blameObj: TBlame): TFlatBlame => {
  let blame = {};

  for (const [key, value] of Object.entries(blameObj)) {
    for (const [key2, value2] of Object.entries(value)) {
      blame[key2] = value2;
    }
  }

  return blame;
};

export const fail = (blame: TBlame, message?: string) => {
  if (isEmpty(blame)) {
    return {
      success: false,
      error: {
        blame: {},
        message
      }
    };
  }

  return {
    success: false,
    error: {
      blame: flattenBlame(blame),
      message
    }
  };
};

export const pass = (data?) => {
  return {
    success: true,
    data
  };
};
