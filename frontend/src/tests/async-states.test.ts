import { describe, expect, it } from 'vitest';
import { emptyState, errorState, loadingState, successState } from '../shared/async-state';

describe('foundation async states', () => {
  it('represents loading, empty, error and success states explicitly', () => {
    expect(loadingState()).toEqual({ status: 'loading' });
    expect(emptyState()).toEqual({ status: 'empty' });
    expect(errorState('failed')).toEqual({ status: 'error', error: 'failed' });
    expect(successState({ ready: true })).toEqual({ status: 'success', data: { ready: true } });
  });
});
