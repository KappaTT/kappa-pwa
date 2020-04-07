import Constants from 'expo-constants';

const manifest = Constants.manifest;

import { jsonRequest, jsonAuthorizedRequest } from '@services/Networking';
import { setItem } from '@services/secureStorage';
import { jsonMockRequest } from '@services/mockService';
import { log } from '@services/logService';
import { isEmpty } from '@services/utils';

export const M_GET = 'GET';
export const M_POST = 'POST';
export const M_PUT = 'PUT';
export const M_PATCH = 'PATCH';
export const M_DELETE = 'DELETE';
export type TMethod = typeof M_GET | typeof M_POST | typeof M_PUT | typeof M_PATCH | typeof M_DELETE;

export const BASE_URL = '';
export const BASE_URL_DEV = 'http://localhost:3000/dev/';

export const BASE_URL_MOCKING = false;

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
  UPDATE_USER: (config: { email: string }) => `users/${encodeURIComponent(config.email)}`,
  GET_EVENTS: () => 'events',
  GET_USERS: () => 'users',
  GET_ATTENDANCE_BY_USER: (config: { email: string }) => `attendance/user/${encodeURIComponent(config.email)}`,
  GET_ATTENDANCE_BY_EVENT: (config: { event_id: string }) => `attendance/event/${config.event_id}`,
  CREATE_EVENT: () => 'events',
  UPDATE_EVENT: (config: { event_id: string }) => `events/${config.event_id}`,
  DELETE_EVENT: (config: { event_id: string }) => `events/${config.event_id}`
};

export const METHODS: {
  [key: string]: TMethod;
} = {
  SIGN_IN: M_POST,
  UPDATE_USER: M_PATCH,
  GET_EVENTS: M_GET,
  GET_USERS: M_GET,
  GET_ATTENDANCE_BY_USER: M_GET,
  GET_ATTENDANCE_BY_EVENT: M_GET,
  CREATE_EVENT: M_POST,
  UPDATE_EVENT: M_POST,
  DELETE_EVENT: M_DELETE
};

export interface TResponse {
  success: boolean;
  error?: {
    message?: string;
    blame?: TFlatBlame;
  };
}

export interface TRequestResponse {
  success: boolean;
  code?: number;
  data?: any;
  error?: {
    message?: string;
    details?: string;
  };
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
