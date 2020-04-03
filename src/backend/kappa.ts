import {
  ENDPOINTS,
  METHODS,
  TResponse,
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
  event_type: string;
  event_code?: string;
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
  event_id: number;
  netid: string;
}

export interface TAttendanceEventDict {
  [event_id: number]: Array<TAttendance>;
}

export interface TAttendanceUserDict {
  [email: string]: {
    [event_id: string]: TAttendance;
  };
}

export interface TExcuse {
  event_id: number;
  netid: string;
  reason: string;
  approved: boolean;
}

export interface TExcuseEventDict {
  [event_id: number]: Array<TExcuse>;
}

export interface TExcuseUserDict {
  [email: string]: {
    [event_id: string]: TExcuse;
  };
}

export interface TPoint {
  event_id: number;
  category: string;
  count: number;
}

export interface TGetEventsPayload {
  user: TUser;
}

interface TGetEventsRequestResponse {
  events: Array<TEvent>;
}

interface TGetEventsResponse extends TResponse {
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

      return fail({}, response.error?.message);
    }

    return pass({
      events: separateByDate(response.data.events)
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen");
  }
};

export interface TGetAttendanceByUserPayload {
  user: TUser;
}

interface TGetAttendanceByUserRequestResponse {
  attended: Array<TAttendance>;
  excused: Array<TExcuse>;
}

interface TGetAttendanceByUserResponse extends TResponse {
  data?: {
    attended: Array<TAttendance>;
    excused: Array<TExcuse>;
  };
}

export const getAttendanceByUser = async (
  payload: TGetAttendanceByUserPayload
): Promise<TGetAttendanceByUserResponse> => {
  try {
    const response = await makeAuthorizedRequest<TGetAttendanceByUserRequestResponse>(
      ENDPOINTS.GET_ATTENDANCE_BY_USER(payload.user),
      METHODS.GET_ATTENDANCE_BY_USER,
      {},
      payload.user.sessionToken
    );

    log('Get attendance response', response.code);

    if (!response.success || response.code === 500) {
      return fail({}, 'problem connecting to server');
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid');
      }

      return fail({}, response.error?.message);
    }

    return pass({
      attended: response.data.attended || [],
      excused: response.data.excused || []
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen");
  }
};

export const getEventById = (eventDict: TEventDict, eventId: number) => {
  for (const [date, events] of Object.entries(eventDict)) {
    for (const event of events) {
      if (event.id === eventId) {
        return event;
      }
    }
  }

  return null;
};
