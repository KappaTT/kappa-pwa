// @ts-ignore
import RNFetchBlob from 'rn-fetch-blob';

import { log } from '@services/logService';

export const prod = RNFetchBlob.fetch !== undefined;

export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const request = async (url: string, method: MethodType, headers: any, body: any) => {
  let response = undefined;

  try {
    if (prod) {
      response = await RNFetchBlob.config({ trusty: true }).fetch(method, url, headers, body);
    } else {
      response = await fetch(url, {
        method,
        headers,
        body
      });
    }
  } catch (error) {
    log(error);

    return {
      success: false,
      error: error
    };
  }

  return {
    success: true,
    data: await response.json()
  };
};

export const customFetch = async (uri: string, options: any) => {
  if (!prod) {
    return fetch(uri, options);
  }

  const { headers, body } = options;

  return RNFetchBlob.config({ trusty: true })
    .fetch('POST', uri, headers, body)
    .then(blobResponse => {
      return new Response(blobResponse.data);
    });
};
