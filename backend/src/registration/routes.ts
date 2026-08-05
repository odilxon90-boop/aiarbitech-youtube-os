import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { getRegistrationSummary } from './registration-service.js';

export function registerRegistrationRoutes(app: FastifyInstance): void {
  app.get('/api/v1/platform/registration', async (request) =>
    successResponse(await getRegistrationSummary(), request.correlationId));

  app.get('/api/v1/platform/registration/status', async (request) => {
    const registration = await getRegistrationSummary();
    return successResponse({ status: registration.status }, request.correlationId);
  });

  app.get('/api/v1/platform/registration/readiness', async (request) => {
    const registration = await getRegistrationSummary();
    return successResponse(registration.readiness, request.correlationId);
  });

  app.get('/api/v1/platform/registration/metadata', async (request) => {
    const registration = await getRegistrationSummary();
    return successResponse(registration.metadata, request.correlationId);
  });
}