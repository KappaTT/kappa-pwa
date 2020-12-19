import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { jsonRequest, jsonAuthorizedRequest } from '@services/Networking';
import { jsonDemoRequest, DEMO_TOKEN } from '@services/demoService';
import { isEmpty } from '@services/utils';
import * as secrets from 'secrets';

export const M_GET = 'GET';
export const M_POST = 'POST';
export const M_PUT = 'PUT';
export const M_PATCH = 'PATCH';
export const M_DELETE = 'DELETE';
export type TMethod = typeof M_GET | typeof M_POST | typeof M_PUT | typeof M_PATCH | typeof M_DELETE;

export const BASE_URL_PRODUCTION = secrets.API_URL;
export const BASE_URL_DEVELOPMENT = 'http://127.0.0.1:3000/dev/';

export const BASE_URL =
  Constants.isDevice || Platform.OS === 'android' || process.env.NODE_ENV !== 'development'
    ? BASE_URL_PRODUCTION
    : BASE_URL_DEVELOPMENT;

export const ENDPOINTS: {
  [key: string]: (config?: any) => string;
} = {
  SIGN_IN: () => 'users/login',
  GENERATE_SECRET_CODE: () => 'users/generate-secret-code',
  CREATE_USER: () => 'users',
  UPDATE_USER: (config: { email: string }) => `users/${encodeURIComponent(config.email)}`,
  DELETE_USER: (config: { email: string }) => `users/${encodeURIComponent(config.email)}`,
  GET_EVENTS: () => 'events',
  GET_USERS: () => 'users',
  GET_ATTENDANCE_BY_USER: (config: { email: string }) => `attendance/user/${encodeURIComponent(config.email)}`,
  GET_ATTENDANCE_BY_EVENT: (config: { eventId: string }) => `attendance/event/${encodeURIComponent(config.eventId)}`,
  CREATE_EVENT: () => 'events',
  UPDATE_EVENT: (config: { eventId: string }) => `events/${encodeURIComponent(config.eventId)}`,
  DELETE_EVENT: (config: { eventId: string }) => `events/${encodeURIComponent(config.eventId)}`,
  CREATE_ATTENDANCE: () => 'attendance',
  GET_EXCUSES: () => 'excuse',
  CREATE_EXCUSE: () => 'excuse',
  UPDATE_EXCUSE: () => 'excuse',
  GET_POINTS_BY_USER: (config: { email: string }) => `points/${encodeURIComponent(config.email)}`,
  GET_EVENT_SEARCH_RESULTS: () => 'search/events',
  GET_ACTIVE_VOTES: () => 'active-candidate/votes',
  SUBMIT_VOTE: () => 'vote',
  SUBMIT_MULTI_VOTE: () => 'multi-vote'
};

export const METHODS: {
  [key: string]: TMethod;
} = {
  SIGN_IN: M_POST,
  CREATE_USER: M_POST,
  UPDATE_USER: M_PATCH,
  DELETE_USER: M_DELETE,
  GET_EVENTS: M_GET,
  GET_USERS: M_GET,
  GET_ATTENDANCE_BY_USER: M_GET,
  GET_ATTENDANCE_BY_EVENT: M_GET,
  CREATE_EVENT: M_POST,
  UPDATE_EVENT: M_PATCH,
  DELETE_EVENT: M_DELETE,
  CREATE_ATTENDANCE: M_POST,
  GET_EXCUSES: M_GET,
  CREATE_EXCUSE: M_POST,
  UPDATE_EXCUSE: M_PATCH,
  GET_POINTS_BY_USER: M_GET,
  GET_EVENT_SEARCH_RESULTS: M_POST,
  GET_ACTIVE_VOTES: M_GET,
  SUBMIT_VOTE: M_POST,
  SUBMIT_MULTI_VOTE: M_POST
};

export interface TResponse {
  success: boolean;
  error?: {
    code?: number;
    message?: string;
    blame?: TFlatBlame;
  };
}

export interface TRequestResponse {
  success: boolean;
  code?: number;
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
  return jsonRequest<T>(BASE_URL, undefined, endpoint, true, method, params.headers, params.queryParams, params.body);
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
  if (token === DEMO_TOKEN) {
    return jsonDemoRequest<T>(endpoint, method);
  }

  return jsonAuthorizedRequest<T>(
    BASE_URL,
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
  const blame = {};

  for (const [key, value] of Object.entries(blameObj)) {
    for (const [key2, value2] of Object.entries(value)) {
      blame[key2] = value2;
    }
  }

  return blame;
};

export const fail = (blame: TBlame, message?: string, code?: number) => {
  if (isEmpty(blame)) {
    return {
      success: false,
      error: {
        blame: {},
        message,
        code
      }
    };
  }

  return {
    success: false,
    error: {
      blame: flattenBlame(blame),
      message,
      code
    }
  };
};

export const pass = <T>(data?: T) => {
  return {
    success: true,
    data
  };
};
