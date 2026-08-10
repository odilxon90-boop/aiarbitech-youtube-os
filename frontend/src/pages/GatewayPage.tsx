import { useEffect, useMemo, useState } from 'react';
import { createGatewayClient, type GatewayClient } from '../gateway/gateway-client';
import type { GatewaySummary, GatewayCallResponse } from '../gateway/types';
import { StatusCard } from '../components/gateway/StatusCard';
import { EndpointList } from '../components/gateway/EndpointList';
import { CallForm } from '../components/gateway/CallForm';
import { LogList } from '../components/gateway/LogList';
import { HealthChart } from '../components/gateway/HealthChart';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface GatewayPageProps {
  client?: GatewayClient;
  initialData?: GatewaySummary;
}

export function GatewayPage({ client, initialData }: GatewayPageProps) {
  const [state, setState] = useState<AsyncState<GatewaySummary>>(() =>
    initialData ? successState(initialData) : loadingState(),
  );
  const gatewayClient = useMemo(() => client ?? createGatewayClient(), [client]);
  const hasInitialData = initialData !== undefined;

  useEffect(() => {
    if (hasInitialData) return;
    const controller = new AbortController();
    setState(loadingState());
    gatewayClient
      .loadSummary(controller.signal)
      .then((data) => setState(successState(data)))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState(errorState(error instanceof Error ? error.message : 'Unable to load gateway data.'));
        }
      });
    return () => controller.abort();
  }, [gatewayClient, hasInitialData]);

  async function handleCall(endpointId: string, payload: Record<string, unknown>): Promise<GatewayCallResponse> {
    return gatewayClient.callEndpoint(endpointId, payload);
  }

  return (
    <section className="gateway-page" aria-label="Integration Gateway">
      <header className="gateway-header">
        <div>
          <p className="section-kicker">Global Ecosystem</p>
          <h2 className="gateway-title">Integration Gateway</h2>
        </div>
      </header>

      {state.status === 'loading' && <LoadingState message="Loading gateway data…" />}
      {state.status === 'empty' && <EmptyState message="No gateway data available." />}
      {state.status === 'error' && (
        <ErrorState message={state.error ?? 'Unable to load the integration gateway.'} />
      )}
      {state.status === 'success' && state.data && (
        <GatewayContent data={state.data} onCall={handleCall} />
      )}
    </section>
  );
}

function GatewayContent({
  data,
  onCall,
}: {
  data: GatewaySummary;
  onCall: (endpointId: string, payload: Record<string, unknown>) => Promise<GatewayCallResponse>;
}) {
  return (
    <div className="gateway-columns">
      <div className="gateway-column">
        <StatusCard status={data.status} />
        <HealthChart health={data.health} />
        <EndpointList endpoints={data.endpoints} />
      </div>
      <div className="gateway-column">
        <CallForm endpoints={data.endpoints} onCall={onCall} />
        <LogList entries={data.logs} />
      </div>
    </div>
  );
}
