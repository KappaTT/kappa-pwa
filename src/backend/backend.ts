import Constants from 'expo-constants';

const manifest = Constants.manifest;

import { jsonRequest, jsonAuthorizedRequest } from '@services/Networking';
import { setItem } from '@services/secureStorage';
import { log } from '@services/logService';

export const M_GET = 'GET';
export const M_POST = 'POST';
export const M_PUT = 'PUT';
export const M_PATCH = 'PATCH';
export const M_DELETE = 'DELETE';
export type TMethod = typeof M_GET | typeof M_POST | typeof M_PUT | typeof M_PATCH | typeof M_DELETE;

export const BASE_URL = 'https://jerde7y95m.execute-api.us-east-1.amazonaws.com/dev/';
export const BASE_URL_DEV = 'http://localhost:3000/dev/';

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
  UPDATE_USER: (config: any) => `users/${config.email}`
};

export const METHODS: {
  [key: string]: TMethod;
} = {
  SIGN_IN: M_POST,
  UPDATE_USER: M_PATCH
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
  data?: TResponseData;
  error?: any;
}

export interface TBlame {
  [key: string]: string;
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

export const fail = (blame: TBlame, message?: string) => {
  if (fail == undefined) {
    return {
      success: false,
      error: {
        message
      }
    };
  }

  return {
    success: false,
    error: {
      blame: blame,
      message
    }
  };
};

export const pass = () => {
  return {
    success: true
  };
};
