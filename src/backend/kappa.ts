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
import { TUser } from '@backend/auth';
import { log } from '@services/logService';
import moment from 'moment';

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
  location: string;
}

export interface TEventDict {
  [date: string]: Array<TEvent>;
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

export interface TGetEventsPayload {
  user: TUser;
}

interface TGetEventsRequestResponse {
  events: Array<TEvent>;
}

interface TGetEventsResponse extends TResponseData {
  data?: {
    events: TEventDict;
  };
}

const separateByDate = (events: Array<TEvent>) => {
  let separated = {};

  for (const event of events) {
    const date = moment(event.start).format('YYYY-MM-DD');

    if (!separated.hasOwnProperty(date)) {
      separated[date] = [];
    }

    separated[date].push(event);
  }

  return separated;
};

export const getEvents = async (payload: TGetEventsPayload): Promise<TGetEventsResponse> => {
  try {
    const response = await makeAuthorizedRequest<TGetEventsRequestResponse>(
      ENDPOINTS.GET_EVENTS(),
      METHODS.GET_EVENTS,
      {},
      payload.user.sessionToken
    );

    log('Get events response', response.code);

    if (!response.success || response.code === 500) {
      return fail({}, 'problem connecting to server');
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid');
      }

      return fail({}, '');
    }

    return pass({
      events: separateByDate(response.data.events)
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen");
  }
};
