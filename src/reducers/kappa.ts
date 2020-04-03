import { TEvent, TEventDict, getEventById, TAttendanceUserDict, TExcuseUserDict, TRecords } from '@backend/kappa';
import { mergeRecords } from '@services/kappaService';

export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

export const GET_ATTENDANCE = 'GET_ATTENDANCE';
export const GET_ATTENDANCE_SUCCESS = 'GET_ATTENDANCE_SUCCESS';
export const GET_ATTENDANCE_FAILURE = 'GET_ATTENDANCE_FAILURE';

export const SELECT_EVENT = 'SELECT_EVENT';
export const UNSELECT_EVENT = 'UNSELECT_EVENT';

export interface TKappaState {
  gettingEvents: boolean;
  getEventsError: boolean;
  getEventsErrorMessage: string;

  gettingAttendance: boolean;
  getAttendanceError: boolean;
  getAttendanceErrorMessage: string;

  events: TEventDict;
  records: TRecords;
  directory: [];

  selectedEventId: number;
  selectedEvent: TEvent;
}

const initialState: TKappaState = {
  gettingEvents: false,
  getEventsError: false,
  getEventsErrorMessage: '',

  gettingAttendance: false,
  getAttendanceError: false,
  getAttendanceErrorMessage: '',

  events: {},
  records: {
    attended: {},
    excused: {}
  },
  directory: [],

  selectedEventId: -1,
  selectedEvent: null
};

export default (state = initialState, action: any): TKappaState => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        gettingEvents: true,
        getEventsError: false,
        getEventsErrorMessage: ''
      };
    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        gettingEvents: false,
        events: action.events
      };
    case GET_EVENTS_FAILURE:
      return {
        ...state,
        gettingEvents: false,
        getEventsError: true,
        getEventsErrorMessage: action.error.message
      };
    case GET_ATTENDANCE:
      return {
        ...state,
        gettingAttendance: true,
        getAttendanceError: false,
        getAttendanceErrorMessage: ''
      };
    case GET_ATTENDANCE_SUCCESS:
      return {
        ...state,
        gettingAttendance: false,
        records: mergeRecords(state.records, {
          attended: action.attended,
          excused: action.excused
        })
      };
    case GET_ATTENDANCE_FAILURE:
      return {
        ...state,
        getAttendanceError: true,
        getAttendanceErrorMessage: action.error.message
      };
    case SELECT_EVENT:
      return {
        ...state,
        selectedEventId: action.eventId,
        selectedEvent: getEventById(state.events, action.eventId)
      };
    case UNSELECT_EVENT:
      return {
        ...state,
        selectedEventId: -1,
        selectedEvent: null
      };
    default:
      return state;
  }
};
