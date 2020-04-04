import { TRequestResponse } from '@backend/backend';
import { log } from '@services/logService';
import mockGetEvents from '@services/mock/mockGetEvents';
import mockGetUsers from '@services/mock/mockGetUsers';
import mockGetAttendanceByUser from '@services/mock/mockGetAttendanceByUser';
import mockGetAttendanceByEvent from '@services/mock/mockGetAttendanceByEvent';

export const getMockEndpoint = (endpoint: string, method: string) => {
  let mock = `${method}|${endpoint}`;
  let arg = '';

  if (['attendance/user/', 'attendance/event/'].includes(endpoint.substring(0, endpoint.lastIndexOf('/') + 1))) {
    mock = `${method}|${endpoint.substring(0, endpoint.lastIndexOf('/') + 1)}`;
    arg = endpoint.substring(endpoint.lastIndexOf('/') + 1);
  }

  switch (mock) {
    case `GET|events`:
      return mockGetEvents;
    case 'GET|users':
      return mockGetUsers;
    case `GET|attendance/user/`:
      return mockGetAttendanceByUser;
    case `GET|attendance/event/`:
      return mockGetAttendanceByEvent(parseInt(arg));
  }

  return null;
};

export const jsonMockRequest = async <T>(
  endpoint: string,
  method: string
): Promise<TRequestResponse & {
  data?: T;
}> => {
  log(`Mocking via ${method}`, endpoint);

  return {
    success: true,
    code: 200,
    data: <T>(<unknown>getMockEndpoint(endpoint, method))
  };
};
