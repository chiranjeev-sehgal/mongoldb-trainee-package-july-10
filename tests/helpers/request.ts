import { createMocks } from 'node-mocks-http';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

interface InvokeRouteOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
  query?: Record<string, string | string[]>;
  body?: Record<string, unknown>;
}

interface MockResponse extends NextApiResponse {
  _getJSONData(): unknown;
}

export async function invokeRoute(
  handler: NextApiHandler,
  options: InvokeRouteOptions
): Promise<{
  req: NextApiRequest;
  res: MockResponse;
  body: unknown;
}> {
  const mocks = createMocks({
    method: options.method,
    query: options.query ?? {},
    body: options.body ?? {}
  });
  const request = mocks.req as NextApiRequest;
  const response = mocks.res as MockResponse;

  await handler(request, response);

  return {
    req: request,
    res: response,
    body: response._getJSONData()
  };
}
