import { TResponse } from '@backend/backend';
import { log } from '@services/logService';
import mockGetEvents from '@services/mock/mockGetEvents';

export const getMockEndpoint = (endpoint: string, method: string) => {
  const mock = `${method}|${endpoint}`;

  switch (mock) {
    case `GET|events`:
      return mockGetEvents;
  }

  return null;
};

export const jsonMockRequest = async <T>(
  endpoint: string,
  method: string
): Promise<TResponse & {
  data?: T;
}> => {
  log(`Mocking via ${method}`, endpoint);

  return {
    success: true,
    code: 200,
    data: <T>(<unknown>getMockEndpoint(endpoint, method))
  };
};
