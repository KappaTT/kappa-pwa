import { TRequestResponse } from '@backend/backend';
import { log } from '@services/logService';
import mockGetEvents from '@services/mock/mockGetEvents';
import mockGetAttendanceByUser from '@services/mock/mockGetAttendanceByUser';
import mockGetAttendanceByEvent from '@services/mock/mockGetAttendanceByEvent';

export const getMockEndpoint = (endpoint: string, method: string) => {
  const mock = `${method}|${endpoint}`;

  switch (mock) {
    case `GET|events`:
      return mockGetEvents;
    case `GET|attendance/user/jjt4%40illinois.edu`:
      return mockGetAttendanceByUser;
    case `GET|attendance/event/1`:
      return mockGetAttendanceByEvent;
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
