import * as SecureStore from 'expo-secure-store';

import { log } from '@services/logService';

export const castTo = (value: string, type: string) => {
  if (typeof value === type) {
    return value;
  }

  switch (type) {
    case 'boolean':
      return value === 'true';
    case 'string':
      return value.toString();
    case 'number':
      return Number(value);
    default:
      return JSON.parse(value);
  }
};

export const castToString = (value: any) => {
  if (typeof value === 'string') {
    return value;
  }

  switch (typeof value) {
    case 'boolean':
    case 'number':
      return value.toString();
    default:
      return JSON.stringify(value);
  }
};

export const setItem = async (key: string, value: any) => {
  try {
    const res = await SecureStore.setItemAsync(key, castToString(value));

    return {
      key: key,
      value: value
    };
  } catch (error) {
    log(error);
    return undefined;
  }
};

export const setBatch = async (parent: string, data: any) => {
  let promises = [];

  for (const [key, value] of Object.entries(data)) {
    promises.push(setItem(`${parent}.${key}`, value));
  }

  try {
    await Promise.all(promises);

    log('Batch saved', data);

    return data;
  } catch (error) {
    log(error);
    return undefined;
  }
};

export const getItem = async (key: string) => {
  try {
    const res = await SecureStore.getItemAsync(key);

    return {
      key: key,
      value: res
    };
  } catch (error) {
    log(error);
    return undefined;
  }
};

export const getBatch = async (parent: string, defaultData: any, force: boolean = false) => {
  let promises = [];

  let loaded: typeof defaultData = {};

  for (const [key, defaultValue] of Object.entries(defaultData)) {
    promises.push(
      new Promise((resolve, reject) => {
        getItem(`${parent}.${key}`).then(res => {
          if (res.value) {
            loaded[key] = castTo(res.value, typeof defaultValue);
            resolve();
          } else if (force) {
            loaded[key] = defaultValue;
            resolve();
          } else {
            reject();
          }
        });
      })
    );
  }

  try {
    await Promise.all(promises);

    log('Batch retrieved', { [parent]: loaded });

    return loaded;
  } catch (error) {
    log(error);
    return undefined;
  }
};

export const deleteItem = async (key: string) => {
  try {
    const res = await SecureStore.deleteItemAsync(key);

    return {
      key: key,
      value: undefined
    };
  } catch (error) {
    log(error);
    return undefined;
  }
};

export const deleteBatch = async (parent: string, data: any) => {
  let promises = [];

  for (const [key, value] of Object.entries(data)) {
    promises.push(deleteItem(`${parent}.${key}`));
  }

  try {
    await Promise.all(promises);

    log('Batch deleted', data);

    return data;
  } catch (error) {
    log(error);
    return undefined;
  }
};
