import {
  ENDPOINTS,
  METHODS,
  TResponseData,
  makeRequest,
  makeAuthorizedRequest,
  pass,
  fail,
  TBlame
} from '@backend/backend';
import { log } from '@services/logService';

export interface TEvent {
  id: number;
  creator: string;
  eventType: string;
  eventCode?: string;
  mandatory: boolean;
  excusable: boolean;
  title: string;
  description: string;
  start: string;
  duration: number;
}

export interface TAttendance {
  eventId: number;
  netid: string;
}

export interface TExcuse {
  eventId: number;
  netid: string;
  reason: string;
  approved: boolean;
}

export interface TPoint {
  eventId: number;
  category: string;
  count: number;
}
