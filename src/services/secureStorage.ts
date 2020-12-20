import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';

import {
  setItemTemplate,
  setBatchTemplate,
  getItemTemplate,
  getBatchTemplate,
  deleteItemTemplate,
  deleteBatchTemplate
} from '@services/storage';

/**
 * Secure storage implementation of setItem.
 */
export const setItem = (key: string, value: any) => setItemTemplate(setItemAsync, key, value);

/**
 * Secure storage implementation of setBatch.
 */
export const setBatch = (parent: string, data: any) => setBatchTemplate(setItem, parent, data);

/**
 * Secure storage implementation of getItem.
 */
export const getItem = (key: string) => getItemTemplate(getItemAsync, key);

/**
 * Secure storage implementation of getBatch.
 */
export const getBatch = (parent: string, defaultData: any, force: boolean = false) =>
  getBatchTemplate(getItem, parent, defaultData, force);

/**
 * Secure storage implementation of deleteItem.
 */
export const deleteItem = (key: string) => deleteItemTemplate(deleteItemAsync, key);

/**
 * Secure storage implementation of deleteBatch.
 */
export const deleteBatch = (parent: string, data: any) => deleteBatchTemplate(deleteItem, parent, data);
