export interface ApiSuccess<T> {
  data: T;
  meta: {
    correlationId: string;
    timestamp: string;
  };
}

export interface ApiErrorDetail {
  field?: string;
  reason: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    correlationId: string;
    retryable: boolean;
    details?: ApiErrorDetail[];
  };
}

export function successResponse<T>(data: T, correlationId: string): ApiSuccess<T> {
  return {
    data,
    meta: {
      correlationId,
      timestamp: new Date().toISOString(),
    },
  };
}
