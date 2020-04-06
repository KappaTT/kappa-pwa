import { Kappa } from '@backend';
import {
  GET_EVENTS,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_FAILURE,
  SELECT_EVENT,
  UNSELECT_EVENT,
  GET_ATTENDANCE,
  GET_ATTENDANCE_SUCCESS,
  GET_ATTENDANCE_FAILURE,
  GET_DIRECTORY,
  GET_DIRECTORY_SUCCESS,
  GET_DIRECTORY_FAILURE,
  SELECT_USER,
  UNSELECT_USER,
  EDIT_NEW_EVENT,
  EDIT_EXISTING_EVENT,
  CANCEL_EDIT_EVENT,
  SAVE_EDIT_EVENT,
  SAVE_EDIT_EVENT_SUCCESS,
  SAVE_EDIT_EVENT_FAILURE
} from '@reducers/kappa';
import { TUser } from '@backend/auth';
import { TEvent, TPoint } from '@backend/kappa';

const gettingEvents = () => {
  return {
    type: GET_EVENTS
  };
};

const getEventsSuccess = data => {
  return {
    type: GET_EVENTS_SUCCESS,
    events: data.events
  };
};

const getEventsFailure = err => {
  return {
    type: GET_EVENTS_FAILURE,
    error: err
  };
};

export const getEvents = (user: TUser) => {
  return dispatch => {
    dispatch(gettingEvents());

    Kappa.getEvents({ user }).then(res => {
      if (res.success) {
        dispatch(getEventsSuccess(res.data));
      } else {
        dispatch(getEventsFailure(res.error));
      }
    });
  };
};

const gettingDirectory = () => {
  return {
    type: GET_DIRECTORY
  };
};

const getDirectorySuccess = data => {
  return {
    type: GET_DIRECTORY_SUCCESS,
    users: data.users
  };
};

const getDirectoryFailure = err => {
  return {
    type: GET_DIRECTORY_FAILURE,
    error: err
  };
};

export const getDirectory = (user: TUser) => {
  return dispatch => {
    dispatch(gettingDirectory());

    Kappa.getUsers({ user }).then(res => {
      if (res.success) {
        dispatch(getDirectorySuccess(res.data));
      } else {
        dispatch(getDirectoryFailure(res.error));
      }
    });
  };
};

const gettingAttendance = () => {
  return {
    type: GET_ATTENDANCE
  };
};

const getAttendanceSuccess = data => {
  return {
    type: GET_ATTENDANCE_SUCCESS,
    attended: data.attended,
    excused: data.excused
  };
};

const getAttendanceFailure = err => {
  return {
    type: GET_ATTENDANCE_FAILURE,
    error: err
  };
};

export const getMyAttendance = (user: TUser) => {
  return getUserAttendance(user, user.email);
};

export const getUserAttendance = (user: TUser, target: string) => {
  return dispatch => {
    dispatch(gettingAttendance());

    Kappa.getAttendanceByUser({ user, target }).then(res => {
      if (res.success) {
        dispatch(getAttendanceSuccess(res.data));
      } else {
        dispatch(getAttendanceFailure(res.error));
      }
    });
  };
};

export const getEventAttendance = (user: TUser, target: string) => {
  return dispatch => {
    dispatch(gettingAttendance());

    Kappa.getAttendanceByEvent({ user, target }).then(res => {
      if (res.success) {
        dispatch(getAttendanceSuccess(res.data));
      } else {
        dispatch(getAttendanceFailure(res.error));
      }
    });
  };
};

export const selectEvent = (event_id: string) => {
  return {
    type: SELECT_EVENT,
    event_id
  };
};

export const unselectEvent = () => {
  return {
    type: UNSELECT_EVENT
  };
};

export const selectUser = (email: string) => {
  return {
    type: SELECT_USER,
    email
  };
};

export const unselectUser = () => {
  return {
    type: UNSELECT_USER
  };
};

export const editNewEvent = () => {
  return {
    type: EDIT_NEW_EVENT
  };
};

export const editExistingEvent = (event_id: string) => {
  return {
    type: EDIT_EXISTING_EVENT,
    event_id
  };
};

export const cancelEditEvent = () => {
  return {
    type: CANCEL_EDIT_EVENT
  };
};

const savingEditEvent = () => {
  return {
    type: SAVE_EDIT_EVENT
  };
};

const saveEditEventSuccess = data => {
  return {
    type: SAVE_EDIT_EVENT_SUCCESS,
    event: data.event
  };
};

const saveEditFailure = err => {
  return {
    type: SAVE_EDIT_EVENT_FAILURE,
    error: err
  };
};

export const saveEditEvent = (user: TUser, event: Partial<TEvent>, points: Array<Partial<TPoint>>) => {
  return dispatch => {
    dispatch(savingEditEvent());

    if (event.id) {
      Kappa.updateEvent({ user, event, points }).then(res => {
        if (res.success) {
          dispatch(saveEditEventSuccess(res.data));
        } else {
          dispatch(saveEditFailure(res.error));
        }
      });
    } else {
      Kappa.createEvent({ user, event, points }).then(res => {
        if (res.success) {
          dispatch(saveEditEventSuccess(res.data));
        } else {
          dispatch(saveEditFailure(res.error));
        }
      });
    }
  };
};
