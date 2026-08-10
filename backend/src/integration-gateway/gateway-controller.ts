import type {
  GatewayStatusResponse,
  EndpointListResponse,
  GatewayCallRequest,
  GatewayCallResponse,
  GatewayLogResponse,
  GatewayHealthResponse,
} from './gateway-service.js';
import {
  getGatewayStatus,
  listEndpoints,
  callEndpoint,
  getGatewayLogs,
  getGatewayHealth,
} from './gateway-service.js';

export interface GatewayController {
  getStatus(): Promise<GatewayStatusResponse>;
  listEndpoints(): Promise<EndpointListResponse>;
  callEndpoint(endpointId: string, payload: GatewayCallRequest): Promise<GatewayCallResponse | null>;
  getLogs(): Promise<GatewayLogResponse>;
  getHealth(): Promise<GatewayHealthResponse>;
}

export const gatewayController: GatewayController = {
  getStatus: () => getGatewayStatus(),
  listEndpoints: () => listEndpoints(),
  callEndpoint: (id, payload) => callEndpoint(id, payload),
  getLogs: () => getGatewayLogs(),
  getHealth: () => getGatewayHealth(),
};
