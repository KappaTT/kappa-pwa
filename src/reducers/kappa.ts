import { TEvent, TEventDict, getEventById } from '@backend/kappa';

export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

export const SELECT_EVENT = 'SELECT_EVENT';
export const UNSELECT_EVENT = 'UNSELECT_EVENT';

export interface TKappaState {
  gettingEvents: boolean;
  getEventsError: boolean;
  getEventsErrorMessage: string;

  events: TEventDict;
  directory: [];

  selectedEventId: number;
  selectedEvent: TEvent;
}

const initialState: TKappaState = {
  gettingEvents: false,
  getEventsError: false,
  getEventsErrorMessage: '',

  events: {},
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
