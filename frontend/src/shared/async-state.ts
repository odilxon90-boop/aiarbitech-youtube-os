export type AsyncStatus = 'loading' | 'success' | 'empty' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: string;
}

export const loadingState = <T>(): AsyncState<T> => ({ status: 'loading' });
export const emptyState = <T>(): AsyncState<T> => ({ status: 'empty' });
export const successState = <T>(data: T): AsyncState<T> => ({ status: 'success', data });
export const errorState = <T>(error: string): AsyncState<T> => ({ status: 'error', error });
