import { TRequestResponse } from '@backend/backend';
import { TUser } from '@backend/auth';
import { log } from '@services/logService';
import demoGetEvents from '@services/demo/demoGetEvents';
import demoGetUsers from '@services/demo/demoGetUsers';
import demoGetAttendanceByUser from '@services/demo/demoGetAttendanceByUser';
import demoGetAttendanceByEvent from '@services/demo/demoGetAttendanceByEvent';

export const DEMO_TOKEN = 'DEMO';

export const DEMO_USER: TUser = {
  _id: 'demo',
  email: 'thetataudemo@gmail.com',
  familyName: 'Jobs',
  givenName: 'Steve',
  firstYear: '2017',
  semester: 'Fall 2018',
  type: 'B',
  gradYear: 'Spring 2021',
  phone: '5555555555',

  sessionToken: DEMO_TOKEN
};

export const getDemoEndpoint = (endpoint: string, method: string) => {
  let demo = `${method}|${endpoint}`;
  let arg = '';

  if (['attendance/user/', 'attendance/event/'].includes(endpoint.substring(0, endpoint.lastIndexOf('/') + 1))) {
    demo = `${method}|${endpoint.substring(0, endpoint.lastIndexOf('/') + 1)}`;
    arg = endpoint.substring(endpoint.lastIndexOf('/') + 1);
  }

  switch (demo) {
    case `GET|events`:
      return demoGetEvents;
    case 'GET|users':
      return demoGetUsers;
    case `GET|attendance/user/`:
      return demoGetAttendanceByUser;
    case `GET|attendance/event/`:
      return demoGetAttendanceByEvent(arg);
    default:
      log('Missed DEMO request', endpoint, method);
  }

  return null;
};

export const jsonDemoRequest = async <T>(
  endpoint: string,
  method: string
): Promise<TRequestResponse & {
  data?: T;
}> => {
  log(`DEMO via ${method}`, endpoint);

  return {
    success: true,
    code: 200,
    data: <T>(<unknown>getDemoEndpoint(endpoint, method))
  };
};
