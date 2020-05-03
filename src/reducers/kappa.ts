import {
  TEvent,
  TAttendanceUserDict,
  TExcuseUserDict,
  TRecords,
  TDirectory,
  TEventDateDict,
  TEventDict,
  TUserEventDict,
  TLoadHistory,
  TPointsUserDict,
  TExcuse,
  TPendingExcuse
} from '@backend/kappa';
import {
  getEventById,
  mergeRecords,
  separateByEmail,
  getUserByEmail,
  separateByEventId,
  mergeEvents,
  recomputeKappaState,
  setGlobalError,
  excludeFromHistory,
  netidToEmail
} from '@services/kappaService';
import { TUser } from '@backend/auth';
import moment from 'moment';

export const SET_GLOBAL_ERROR_MESSAGE = 'SET_GLOBAL_ERROR_MESSAGE';
export const CLEAR_GLOBAL_ERROR_MESSAGE = 'CLEAR_GLOBAL_ERROR_MESSAGE';

export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

export const GET_DIRECTORY = 'GET_DIRECTORY';
export const GET_DIRECTORY_SUCCESS = 'GET_DIRECTORY_SUCCESS';
export const GET_DIRECTORY_FAILURE = 'GET_DIRECTORY_FAILURE';

export const GET_ATTENDANCE = 'GET_ATTENDANCE';
export const GET_ATTENDANCE_SUCCESS = 'GET_ATTENDANCE_SUCCESS';
export const GET_ATTENDANCE_FAILURE = 'GET_ATTENDANCE_FAILURE';

export const GET_EXCUSES = 'GET_EXCUSES';
export const GET_EXCUSES_SUCCESS = 'GET_EXCUSES_SUCCESS';
export const GET_EXCUSES_FAILURE = 'GET_EXCUSES_FAILURE';

export const GET_POINTS = 'GET_POINTS';
export const GET_POINTS_SUCCESS = 'GET_POINTS_SUCCESS';
export const GET_POINTS_FAILURE = 'GET_POINTS_FAILURE';

export const SELECT_EVENT = 'SELECT_EVENT';
export const UNSELECT_EVENT = 'UNSELECT_EVENT';

export const SELECT_USER = 'SELECT_USER';
export const UNSELECT_USER = 'UNSELECT_USER';

export const EDIT_NEW_EVENT = 'EDIT_NEW_EVENT';
export const EDIT_EXISTING_EVENT = 'EDIT_EXISTING_EVENT';
export const CANCEL_EDIT_EVENT = 'CANCEL_EDIT_EVENT';
export const SAVE_EDIT_EVENT = 'SAVE_EDIT_EVENT';
export const SAVE_EDIT_EVENT_SUCCESS = 'SAVE_EDIT_EVENT_SUCCESS';
export const SAVE_EDIT_EVENT_FAILURE = 'SAVE_EDIT_EVENT_FAILURE';
export const DELETE_EVENT = 'DELETE_EVENT';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';

export const SET_CHECK_IN_EVENT = 'SET_CHECK_IN_EVENT';
export const CHECK_IN = 'CHECK_IN';
export const CHECK_IN_SUCCESS = 'CHECK_IN_SUCCESS';
export const CHECK_IN_FAILURE = 'CHECK_IN_FAILURE';
export const CREATE_EXCUSE = 'CREATE_EXCUSE';
export const CREATE_EXCUSE_SUCCESS = 'CREATE_EXCUSE_SUCCESS';
export const CREATE_EXCUSE_FAILURE = 'CREATE_EXCUSE_FAILURE';

export const APPROVE_EXCUSE = 'APPROVE_EXCUSE';
export const APPROVE_EXCUSE_SUCCESS = 'APPROVE_EXCUSE_SUCCESS';
export const APPROVE_EXCUSE_FAILURE = 'APPROVE_EXCUSE_FAILURE';
export const REJECT_EXCUSE = 'REJECT_EXCUSE';
export const REJECT_EXCUSE_SUCCESS = 'REJECT_EXCUSE_SUCCESS';
export const REJECT_EXCUSE_FAILURE = 'REJECT_EXCUSE_FAILURE';

export interface TKappaState {
  globalErrorMessage: string;
  globalErrorCode: number;
  globalErrorDate: Date;

  isGettingEvents: boolean;
  getEventsError: boolean;
  getEventsErrorMessage: string;

  isGettingDirectory: boolean;
  getDirectoryError: boolean;
  getDirectoryErrorMessage: string;

  isGettingAttendance: boolean;
  getAttendanceError: boolean;
  getAttendanceErrorMessage: string;

  isGettingExcuses: boolean;
  getExcusesError: boolean;
  getExcusesErrorMessage: string;

  isGettingPoints: boolean;
  getPointsError: boolean;
  getPointsErrorMessage: string;

  loadHistory: TLoadHistory;
  eventArray: TEvent[];
  events: TEventDict;
  futureEventArray: TEvent[];
  futureEvents: TEventDict;
  eventsByDate: TEventDateDict;
  mandatoryEvents: TEventDict;
  missedMandatory: TUserEventDict;
  records: TRecords;
  directory: TDirectory;
  points: TPointsUserDict;
  pendingExcusesArray: TPendingExcuse[];
  eventSections: {
    title: string;
    data: TEvent[];
  }[];
  upcomingSections: {
    title: string;
    data: TEvent[];
  }[];
  futureIndex: number;

  eventsSize: number;
  gmCount: number;
  selectedEventId: string;
  selectedEvent: TEvent;

  directorySize: number;
  selectedUserEmail: string;
  selectedUser: TUser;

  editingEventId: string;
  isSavingEvent: boolean;
  saveEventError: boolean;
  saveEventErrorMessage: string;

  isDeletingEvent: boolean;
  deleteEventError: boolean;
  deleteEventErrorMessage: string;

  checkInEventId: string;
  checkInExcuse: boolean;

  isCheckingIn: boolean;
  checkInError: boolean;
  checkInErrorMessage: string;
  checkInRequestDate: moment.Moment;
  checkInSuccessDate: moment.Moment;
  isCreatingExcuse: boolean;
  createExcuseError: boolean;
  createExcuseErrorMessage: string;
  createExcuseRequestDate: moment.Moment;
  createExcuseSuccessDate: moment.Moment;

  isApprovingExcuse: boolean;
  approveExcuseError: boolean;
  approveExcuseErrorMessage: string;
  approveExcuseRequestDate: moment.Moment;
  approveExcuseSuccessDate: moment.Moment;
  isRejectingExcuse: boolean;
  rejectExcuseError: boolean;
  rejectExcuseErrorMessage: string;
  rejectExcuseRequestDate: moment.Moment;
  rejectExcuseSuccessDate: moment.Moment;
}

const initialState: TKappaState = {
  globalErrorMessage: '',
  globalErrorCode: 0,
  globalErrorDate: null,

  isGettingEvents: false,
  getEventsError: false,
  getEventsErrorMessage: '',

  isGettingDirectory: false,
  getDirectoryError: false,
  getDirectoryErrorMessage: '',

  isGettingAttendance: false,
  getAttendanceError: false,
  getAttendanceErrorMessage: '',

  isGettingExcuses: false,
  getExcusesError: false,
  getExcusesErrorMessage: '',

  isGettingPoints: false,
  getPointsError: false,
  getPointsErrorMessage: '',

  loadHistory: {},
  eventArray: [],
  events: {},
  futureEventArray: [],
  futureEvents: {},
  eventsByDate: {},
  mandatoryEvents: {},
  missedMandatory: {},
  records: {
    attended: {},
    excused: {}
  },
  directory: {},
  points: {},
  pendingExcusesArray: [],
  eventSections: [],
  upcomingSections: [],
  futureIndex: -1,

  eventsSize: 0,
  gmCount: 0,
  selectedEventId: '',
  selectedEvent: null,

  directorySize: 0,
  selectedUserEmail: '',
  selectedUser: null,

  editingEventId: '',
  isSavingEvent: false,
  saveEventError: false,
  saveEventErrorMessage: '',

  isDeletingEvent: false,
  deleteEventError: false,
  deleteEventErrorMessage: '',

  checkInEventId: '',
  checkInExcuse: false,

  isCheckingIn: false,
  checkInError: false,
  checkInErrorMessage: '',
  checkInRequestDate: null,
  checkInSuccessDate: null,
  isCreatingExcuse: false,
  createExcuseError: false,
  createExcuseErrorMessage: '',
  createExcuseRequestDate: null,
  createExcuseSuccessDate: null,

  isApprovingExcuse: false,
  approveExcuseError: false,
  approveExcuseErrorMessage: '',
  approveExcuseRequestDate: null,
  approveExcuseSuccessDate: null,
  isRejectingExcuse: false,
  rejectExcuseError: false,
  rejectExcuseErrorMessage: '',
  rejectExcuseRequestDate: null,
  rejectExcuseSuccessDate: null
};

export default (state = initialState, action: any): TKappaState => {
  switch (action.type) {
    case SET_GLOBAL_ERROR_MESSAGE:
      return {
        ...state,
        ...setGlobalError(action.message, action.code)
      };
    case CLEAR_GLOBAL_ERROR_MESSAGE:
      return {
        ...state,
        globalErrorMessage: '',
        globalErrorCode: 0,
        globalErrorDate: null
      };
    case GET_EVENTS:
      return {
        ...state,
        isGettingEvents: true,
        getEventsError: false,
        getEventsErrorMessage: ''
      };
    case GET_EVENTS_SUCCESS:
      return {
        ...state,
        isGettingEvents: false,
        loadHistory: {
          ...state.loadHistory,
          events: moment()
        },
        ...recomputeKappaState({
          events: separateByEventId(action.events),
          records: state.records,
          directory: state.directory
        })
      };
    case GET_EVENTS_FAILURE:
      return {
        ...state,
        isGettingEvents: false,
        getEventsError: true,
        getEventsErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case GET_DIRECTORY:
      return {
        ...state,
        isGettingDirectory: true,
        getDirectoryError: false,
        getDirectoryErrorMessage: ''
      };
    case GET_DIRECTORY_SUCCESS:
      return {
        ...state,
        isGettingDirectory: false,
        loadHistory: {
          ...state.loadHistory,
          directory: moment()
        },
        ...recomputeKappaState({
          events: state.events,
          records: state.records,
          directory: separateByEmail(action.users)
        })
      };
    case GET_DIRECTORY_FAILURE:
      return {
        ...state,
        isGettingDirectory: false,
        getDirectoryError: true,
        getDirectoryErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case GET_ATTENDANCE:
      return {
        ...state,
        isGettingAttendance: true,
        getAttendanceError: false,
        getAttendanceErrorMessage: ''
      };
    case GET_ATTENDANCE_SUCCESS: {
      let newLoadHistory = {};

      if (action.overwrite) {
        newLoadHistory = excludeFromHistory(
          state.loadHistory,
          (key: string) => key.startsWith('user-') || key.startsWith('event-')
        );

        newLoadHistory[action.loadKey] = moment();
      } else {
        newLoadHistory = {
          ...state.loadHistory,
          [action.loadKey]: moment()
        };
      }

      return {
        ...state,
        isGettingAttendance: false,
        loadHistory: newLoadHistory,
        ...recomputeKappaState({
          events: state.events,
          records: mergeRecords(
            state.records,
            {
              attended: action.attended,
              excused: action.excused
            },
            action.overwrite
          ),
          directory: state.directory
        })
      };
    }
    case GET_ATTENDANCE_FAILURE:
      return {
        ...state,
        isGettingAttendance: false,
        getAttendanceError: true,
        getAttendanceErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case GET_EXCUSES:
      return {
        ...state,
        isGettingExcuses: true,
        getExcusesError: false,
        getExcusesErrorMessage: ''
      };
    case GET_EXCUSES_SUCCESS:
      return {
        ...state,
        isGettingExcuses: false,
        pendingExcusesArray: action.pending,
        loadHistory: {
          ...state.loadHistory,
          excuses: moment()
        }
      };
    case GET_EXCUSES_FAILURE:
      return {
        ...state,
        isGettingExcuses: false,
        getExcusesError: true,
        getExcusesErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case SELECT_EVENT:
      return {
        ...state,
        selectedEventId: action.event_id,
        selectedEvent: getEventById(state.events, action.event_id)
      };
    case UNSELECT_EVENT:
      return {
        ...state,
        selectedEventId: '',
        selectedEvent: null
      };
    case SELECT_USER:
      return {
        ...state,
        selectedUserEmail: action.email,
        selectedUser: getUserByEmail(state.directory, action.email)
      };
    case UNSELECT_USER:
      return {
        ...state,
        selectedUserEmail: '',
        selectedUser: null
      };
    case EDIT_NEW_EVENT:
      return {
        ...state,
        editingEventId: 'NEW',
        saveEventError: false,
        saveEventErrorMessage: ''
      };
    case EDIT_EXISTING_EVENT:
      return {
        ...state,
        editingEventId: action.event_id,
        saveEventError: false,
        saveEventErrorMessage: ''
      };
    case CANCEL_EDIT_EVENT:
      return {
        ...state,
        editingEventId: ''
      };
    case SAVE_EDIT_EVENT:
      return {
        ...state,
        isSavingEvent: true,
        saveEventError: false,
        saveEventErrorMessage: ''
      };
    case SAVE_EDIT_EVENT_SUCCESS:
      return {
        ...state,
        isSavingEvent: false,
        selectedEventId: '',
        selectedEvent: null,
        editingEventId: '',
        loadHistory: excludeFromHistory(state.loadHistory, (key: string) => key.startsWith('points-')),
        ...recomputeKappaState({
          events: mergeEvents(state.events, [action.event]),
          records: state.records,
          directory: state.directory
        })
      };
    case SAVE_EDIT_EVENT_FAILURE:
      return {
        ...state,
        isSavingEvent: false,
        saveEventError: true,
        saveEventErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case DELETE_EVENT:
      return {
        ...state,
        isDeletingEvent: true,
        deleteEventError: false,
        deleteEventErrorMessage: ''
      };
    case DELETE_EVENT_SUCCESS: {
      const remainingEvents = state.events;
      delete remainingEvents[action.event.id];

      return {
        ...state,
        isDeletingEvent: false,
        selectedEventId: '',
        selectedEvent: null,
        loadHistory: excludeFromHistory(state.loadHistory, (key: string) => key.startsWith('points-')),
        ...recomputeKappaState({
          events: remainingEvents,
          records: state.records,
          directory: state.directory
        })
      };
    }
    case DELETE_EVENT_FAILURE:
      return {
        ...state,
        isDeletingEvent: false,
        deleteEventError: true,
        deleteEventErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case SET_CHECK_IN_EVENT:
      return {
        ...state,
        checkInEventId: action.event_id,
        checkInExcuse: action.excuse
      };
    case CHECK_IN:
      return {
        ...state,
        isCheckingIn: true,
        checkInError: false,
        checkInErrorMessage: '',
        checkInRequestDate: moment()
      };
    case CHECK_IN_SUCCESS:
      return {
        ...state,
        isCheckingIn: false,
        checkInSuccessDate: moment(),
        loadHistory: excludeFromHistory(
          state.loadHistory,
          (key: string) => key === `points-${netidToEmail(action.attended[0].netid)}`
        ),
        ...recomputeKappaState({
          events: state.events,
          records: mergeRecords(state.records, {
            attended: action.attended,
            excused: []
          }),
          directory: state.directory
        })
      };
    case CHECK_IN_FAILURE:
      return {
        ...state,
        isCheckingIn: false,
        checkInError: true,
        checkInErrorMessage: action.error.message,
        globalErrorMessage: action.error.message,
        globalErrorCode: action.error.code
      };
    case CREATE_EXCUSE:
      return {
        ...state,
        isCreatingExcuse: true,
        createExcuseError: false,
        createExcuseErrorMessage: '',
        createExcuseRequestDate: moment()
      };
    case CREATE_EXCUSE_SUCCESS:
      return {
        ...state,
        isCreatingExcuse: false,
        createExcuseSuccessDate: moment(),
        pendingExcusesArray: state.pendingExcusesArray.concat(action.pending),
        ...recomputeKappaState({
          events: state.events,
          records: mergeRecords(state.records, {
            attended: [],
            excused: action.excused
          }),
          directory: state.directory
        })
      };
    case CREATE_EXCUSE_FAILURE:
      return {
        ...state,
        isCreatingExcuse: false,
        createExcuseError: true,
        createExcuseErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case APPROVE_EXCUSE:
      return {
        ...state,
        isApprovingExcuse: true,
        approveExcuseError: false,
        approveExcuseErrorMessage: '',
        approveExcuseRequestDate: moment()
      };
    case APPROVE_EXCUSE_SUCCESS:
      return {
        ...state,
        isApprovingExcuse: false,
        approveExcuseSuccessDate: moment(),
        pendingExcusesArray: state.pendingExcusesArray.filter(
          (excuse: TPendingExcuse) =>
            excuse.event_id !== action.excused[0].event_id || excuse.netid !== action.excused[0].netid
        ),
        loadHistory: excludeFromHistory(
          state.loadHistory,
          (key: string) => key === `points-${netidToEmail(action.excused[0].netid)}`
        ),
        ...recomputeKappaState({
          events: state.events,
          records: mergeRecords(state.records, {
            attended: [],
            excused: action.excused
          }),
          directory: state.directory
        })
      };
    case APPROVE_EXCUSE_FAILURE:
      return {
        ...state,
        isApprovingExcuse: false,
        approveExcuseError: true,
        approveExcuseErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case REJECT_EXCUSE:
      return {
        ...state,
        isRejectingExcuse: true,
        rejectExcuseError: false,
        rejectExcuseErrorMessage: '',
        rejectExcuseRequestDate: moment()
      };
    case REJECT_EXCUSE_SUCCESS:
      return {
        ...state,
        isRejectingExcuse: false,
        rejectExcuseSuccessDate: moment(),
        pendingExcusesArray: state.pendingExcusesArray.filter(
          (excuse: TPendingExcuse) =>
            excuse.event_id !== action.excused[0].event_id || excuse.netid !== action.excused[0].netid
        ),
        ...recomputeKappaState({
          events: state.events,
          records: mergeRecords(state.records, {
            attended: [],
            excused: action.excused
          }),
          directory: state.directory
        })
      };
    case REJECT_EXCUSE_FAILURE:
      return {
        ...state,
        isRejectingExcuse: false,
        rejectExcuseError: true,
        rejectExcuseErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    case GET_POINTS:
      return {
        ...state,
        isGettingPoints: true,
        getPointsError: false,
        getPointsErrorMessage: ''
      };
    case GET_POINTS_SUCCESS:
      return {
        ...state,
        isGettingPoints: false,
        points: {
          ...state.points,
          [action.target]: action.points
        },
        loadHistory: {
          ...state.loadHistory,
          [`points-${action.target}`]: moment()
        }
      };
    case GET_POINTS_FAILURE:
      return {
        ...state,
        isGettingPoints: false,
        getPointsError: true,
        getPointsErrorMessage: action.error.message,
        ...setGlobalError(action.error.message, action.error.code)
      };
    default:
      return state;
  }
};
