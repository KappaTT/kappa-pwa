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
  id: string;
  creator: string;
  event_type: string;
  event_code?: string;
  mandatory: 0 | 1;
  excusable: 0 | 1;
  title: string;
  description: string;
  start: string;
  duration: number;
  location: string;
  points: string;
}

export interface TEventDict {
  [event_id: string]: TEvent;
}

export interface TEventDateDict {
  [date: string]: Array<TEvent>;
}

export interface TUserEventDict {
  [email: string]: TEventDict;
}

export interface TDirectory {
  [email: string]: TUser;
}

export interface TAttendance {
  event_id: string;
  netid: string;
}

export interface TAttendanceEventDict {
  [event_id: string]: TAttendance;
}

export interface TAttendanceUserDict {
  [email: string]: TAttendanceEventDict;
}

export interface TExcuse {
  event_id: string;
  netid: string;
  reason: string;
  approved: 0 | 1;
}

export interface TExcuseEventDict {
  [event_id: string]: TExcuse;
}

export interface TExcuseUserDict {
  [email: string]: TExcuseEventDict;
}

export interface TRecords {
  attended: TAttendanceUserDict;
  excused: TExcuseUserDict;
}

export interface TPoint {
  event_id: string;
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
    events: Array<TEvent>;
  };
}

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
      events: response.data.events
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen");
  }
};

export interface TCreateEventPayload {
  user: TUser;
  event: Partial<TEvent>;
  points: Array<Partial<TPoint>>;
}

interface TCreateEventRequestResponse {
  event: TEvent;
}

interface TCreateEventResponse extends TResponse {
  data?: {
    event: TEvent;
  };
}

export const createEvent = async (payload: TCreateEventPayload): Promise<TCreateEventResponse> => {
  try {
    const response = await makeAuthorizedRequest<TCreateEventRequestResponse>(
      ENDPOINTS.CREATE_EVENT(),
      METHODS.CREATE_EVENT,
      {
        body: {
          event: payload.event,
          points: payload.points
        }
      },
      payload.user.sessionToken
    );

    log('Get create event response', response.code);

    if (!response.success || response.code === 500) {
      return fail({}, 'problem connecting to server');
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid');
      }

      return fail({}, response.error?.message);
    }

    return pass({
      event: response.data.event
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen");
  }
};

export interface TUpdateEventPayload {
  user: TUser;
  event: Partial<TEvent>;
  points: Array<Partial<TPoint>>;
}

interface TUpdateEventRequestResponse {
  event: TEvent;
}

interface TUpdateEventResponse extends TResponse {
  data?: {
    event: TEvent;
  };
}

export const updateEvent = async (payload: TUpdateEventPayload): Promise<TUpdateEventResponse> => {
  try {
    const response = await makeAuthorizedRequest<TUpdateEventRequestResponse>(
      ENDPOINTS.UPDATE_EVENT({ event_id: payload.event.id }),
      METHODS.UPDATE_EVENT,
      {
        body: {
          event: payload.event,
          points: payload.points
        }
      },
      payload.user.sessionToken
    );

    log('Get create event response', response.code);

    if (!response.success || response.code === 500) {
      return fail({}, 'problem connecting to server');
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid');
      }

      return fail({}, response.error?.message);
    }

    return pass({
      event: response.data.event
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen");
  }
};

export interface TGetUsersPayload {
  user: TUser;
}

interface TGetUsersRequestResponse {
  users: Array<TUser>;
}

interface TGetUsersResponse extends TResponse {
  data?: {
    users: Array<TUser>;
  };
}

export const getUsers = async (payload: TGetUsersPayload): Promise<TGetUsersResponse> => {
  try {
    const response = await makeAuthorizedRequest<TGetUsersRequestResponse>(
      ENDPOINTS.GET_USERS(),
      METHODS.GET_USERS,
      {},
      payload.user.sessionToken
    );

    log('Get users response', response.code);

    if (!response.success || response.code === 500) {
      return fail({}, 'problem connecting to server');
    } else if (response.code !== 200) {
      if (response.code === 401) {
        return fail({}, 'your credentials were invalid');
      }

      return fail({}, response.error?.message);
    }

    return pass({
      users: response.data.users
    });
  } catch (error) {
    log(error);
    return fail({}, "that wasn't supposed to happen");
  }
};

export interface TGetAttendancePayload {
  user: TUser;
  target: string;
}

interface TGetAttendanceRequestResponse {
  attended: Array<TAttendance>;
  excused: Array<TExcuse>;
}

interface TGetAttendanceResponse extends TResponse {
  data?: {
    attended: Array<TAttendance>;
    excused: Array<TExcuse>;
  };
}

export const getAttendanceByUser = async (payload: TGetAttendancePayload): Promise<TGetAttendanceResponse> => {
  try {
    const response = await makeAuthorizedRequest<TGetAttendanceRequestResponse>(
      ENDPOINTS.GET_ATTENDANCE_BY_USER({ email: payload.target }),
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

export const getAttendanceByEvent = async (payload: TGetAttendancePayload): Promise<TGetAttendanceResponse> => {
  try {
    const response = await makeAuthorizedRequest<TGetAttendanceRequestResponse>(
      ENDPOINTS.GET_ATTENDANCE_BY_EVENT({ event_id: payload.target }),
      METHODS.GET_ATTENDANCE_BY_EVENT,
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
