import type { Instrumentation } from 'next';

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const digest = typeof error === 'object'
    && error !== null
    && 'digest' in error
    && typeof error.digest === 'string'
    ? error.digest
    : undefined;

  console.error(JSON.stringify({
    event: 'server_request_error',
    method: request.method,
    route: context.routePath,
    routeType: context.routeType,
    ...(digest ? { digest } : {}),
    occurredAt: new Date().toISOString(),
  }));
};
