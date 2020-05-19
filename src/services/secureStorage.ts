import * as SecureStore from 'expo-secure-store';

import {
  setItemTemplate,
  setBatchTemplate,
  getItemTemplate,
  getBatchTemplate,
  deleteItemTemplate,
  deleteBatchTemplate
} from '@services/storage';

export const setItem = (key: string, value: any) => setItemTemplate(SecureStore.setItemAsync, key, value);

export const setBatch = (parent: string, data: any) => setBatchTemplate(setItem, parent, data);

export const getItem = (key: string) => getItemTemplate(SecureStore.getItemAsync, key);

export const getBatch = (parent: string, defaultData: any, force: boolean = false) =>
  getBatchTemplate(getItem, parent, defaultData, force);

export const deleteItem = (key: string) => deleteItemTemplate(SecureStore.deleteItemAsync, key);

export const deleteBatch = (parent: string, data: any) => deleteBatchTemplate(deleteItem, parent, data);
