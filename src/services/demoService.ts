import { TRequestResponse } from '@backend/backend';
import { TUser } from '@backend/auth';
import { log } from '@services/logService';
import demoGetEvents from '@services/demo/demoGetEvents';
import demoGetUsers from '@services/demo/demoGetUsers';
import demoGetAttendanceByUser from '@services/demo/demoGetAttendanceByUser';
import demoGetAttendanceByEvent from '@services/demo/demoGetAttendanceByEvent';
import demoGetPoints from '@services/demo/demoGetPoints';
import demoGetExcuses from '@services/demo/demoGetExcuses';
import demoPatchUser from '@services/demo/demoPatchUser';

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

  if (
    ['attendance/user/', 'attendance/event/', 'points/', 'users/'].includes(
      endpoint.substring(0, endpoint.lastIndexOf('/') + 1)
    )
  ) {
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
    case `GET|excuse`:
      return demoGetExcuses;
    case `GET|points/`:
      return demoGetPoints;
    case `PATCH|users/`:
      return demoPatchUser;
    default:
      log('Missed DEMO request', endpoint, demo, method);
  }

  return null;
};

export const jsonDemoRequest = async <T>(
  endpoint: string,
  method: string
): Promise<
  TRequestResponse & {
    data?: T;
  }
> => {
  log(`DEMO via ${method}`, endpoint);

  return {
    success: true,
    code: 200,
    data: (getDemoEndpoint(endpoint, method) as unknown) as T
  };
};
