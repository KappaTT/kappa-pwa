import { TRequestResponse } from '@backend/backend';
import { log } from '@services/logService';
import demoGetEvents from '@services/demo/demoGetEvents';
import demoGetUsers from '@services/demo/demoGetUsers';
import demoGetAttendanceByUser from '@services/demo/demoGetAttendanceByUser';
import demoGetAttendanceByEvent from '@services/demo/demoGetAttendanceByEvent';

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
      return demoGetAttendanceByUser(arg);
    case `GET|attendance/event/`:
      return demoGetAttendanceByEvent(arg);
  }

  return null;
};

export const jsonDemoRequest = async <T>(
  endpoint: string,
  method: string
): Promise<TRequestResponse & {
  data?: T;
}> => {
  log(`Mocking via ${method}`, endpoint);

  return {
    success: true,
    code: 200,
    data: <T>(<unknown>getDemoEndpoint(endpoint, method))
  };
};
