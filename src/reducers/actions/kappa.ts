import { Kappa } from '@backend';
import { GET_EVENTS, GET_EVENTS_SUCCESS, GET_EVENTS_FAILURE, SELECT_EVENT, UNSELECT_EVENT } from '@reducers/kappa';
import { TUser } from '@backend/auth';

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

export const getDirectory = () => {};

export const selectEvent = (eventId: number) => {
  return {
    type: SELECT_EVENT,
    eventId
  };
};

export const unselectEvent = () => {
  return {
    type: UNSELECT_EVENT
  };
};
