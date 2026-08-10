/**
 * AIArbiTech YouTube OS — Load Testing Script (k6)
 *
 * Usage:
 *   k6 run load-test/script.js --stage smoke
 *   k6 run load-test/script.js --stage load
 *   k6 run load-test/script.js --stage stress
 *   k6 run load-test/script.js --stage spike
 *
 * Or run all stages:
 *   k6 run load-test/script.js
 *
 * Requires: k6 installed globally (https://k6.io/docs/getting-started/installation/)
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3100';

// Mock tokens for different roles
const tokens = {
  creator: 'mock-creator-token',
  admin: 'mock-admin-token',
  president: 'mock-president-token',
  aiSync: 'mock-ai-sync-token',
};

// Test scenarios with different load profiles
export const options = {
  stages: [
    // Smoke test: 1 user, 1 minute
    {
      duration: '1m',
      target: 1,
      name: 'smoke',
    },
    // Ramp up to load test: 50 concurrent users, 5 minutes
    {
      duration: '1m',
      target: 50,
      name: 'rampUp',
    },
    {
      duration: '5m',
      target: 50,
      name: 'load',
    },
    // Ramp down to stress test: 200 users, 3 minutes
    {
      duration: '1m',
      target: 200,
      name: 'stressRamp',
    },
    {
      duration: '3m',
      target: 200,
      name: 'stress',
    },
    // Spike test: sudden spike to 500 users
    {
      duration: '30s',
      target: 500,
      name: 'spike',
    },
    // Cool down
    {
      duration: '1m',
      target: 0,
      name: 'coolDown',
    },
  ],

  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'http_req_failed': ['rate<0.1'],
    'checks': ['rate>=0.95'],
  },
};

// ─── Test functions ───────────────────────────────────────────────────────────

export default function main() {
  // Health check
  group('Health — ping', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 100ms': (r) => r.timings.duration < 100,
    });
    sleep(0.5);
  });

  // Dashboard endpoints
  group('Dashboard — authenticated read', () => {
    const res = http.get(`${BASE_URL}/api/v1/dashboard/summary`, {
      headers: { Authorization: `Bearer ${tokens.creator}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
      'has data': (r) => JSON.parse(r.body).data !== undefined,
    });
    sleep(0.5);
  });

  // Analytics endpoints
  group('Analytics — trend analysis', () => {
    const res = http.get(`${BASE_URL}/api/v1/analytics/trends`, {
      headers: { Authorization: `Bearer ${tokens.creator}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    sleep(0.5);
  });

  // Goals endpoints (mixed read/write)
  group('Goals — CRUD operations', () => {
    // GET list
    const getRes = http.get(`${BASE_URL}/api/v1/goals/list`, {
      headers: { Authorization: `Bearer ${tokens.creator}` },
    });
    check(getRes, {
      'GET status is 200': (r) => r.status === 200,
    });

    // POST create (if we reach stable load phase)
    const postRes = http.post(
      `${BASE_URL}/api/v1/goals/create`,
      JSON.stringify({
        title: `Test Goal ${Date.now()}`,
        target: Math.floor(Math.random() * 100000),
        unit: 'subscribers',
        dueDate: '2026-12-31',
      }),
      {
        headers: {
          Authorization: `Bearer ${tokens.creator}`,
          'Content-Type': 'application/json',
        },
      },
    );
    check(postRes, {
      'POST status is 201 or 200': (r) => r.status === 200 || r.status === 201,
    });
    sleep(0.5);
  });

  // Intelligence — read-heavy
  group('Intelligence — profile & analysis', () => {
    const res = http.get(`${BASE_URL}/api/v1/intelligence/profile`, {
      headers: { Authorization: `Bearer ${tokens.creator}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 600ms': (r) => r.timings.duration < 600,
    });
    sleep(0.5);
  });

  // Memory endpoints
  group('Memory — preferences & learning', () => {
    const res = http.get(`${BASE_URL}/api/v1/memory/summary`, {
      headers: { Authorization: `Bearer ${tokens.creator}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(0.5);
  });

  // Genre — catalog read
  group('Genre — trends & recommendations', () => {
    const res = http.get(`${BASE_URL}/api/v1/genre/trends`, {
      headers: { Authorization: `Bearer ${tokens.creator}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 400ms': (r) => r.timings.duration < 400,
    });
    sleep(0.5);
  });

  // Admin — privileged operations
  group('Admin — users & configuration', () => {
    const res = http.get(`${BASE_URL}/api/v1/admin/users`, {
      headers: { Authorization: `Bearer ${tokens.admin}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'permission enforced': (r) => r.status !== 403,
    });
    sleep(0.5);
  });

  // AI Sync — critical module
  group('AI Sync — status & models', () => {
    const res = http.get(`${BASE_URL}api/v1/ai-sync/status`, {
      headers: { Authorization: `Bearer ${tokens.aiSync}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 300ms': (r) => r.timings.duration < 300,
    });
    sleep(0.5);
  });

  // Integration Gateway
  group('Gateway — integration endpoints', () => {
    const res = http.get(`${BASE_URL}/api/v1/gateway/status`, {
      headers: { Authorization: `Bearer ${tokens.admin}` },
    });
    check(res, {
      'status is 200': (r) => r.status === 200,
      'has circuit breaker info': (r) => {
        const body = JSON.parse(r.body);
        return body.data && body.data.circuitBreaker;
      },
    });
    sleep(0.5);
  });

  // Error scenarios
  group('Error handling — 401 / 403', () => {
    // No token
    const noAuthRes = http.get(`${BASE_URL}/api/v1/dashboard/summary`);
    check(noAuthRes, {
      'no auth returns 401': (r) => r.status === 401,
    });

    // Invalid token
    const badTokenRes = http.get(`${BASE_URL}/api/v1/dashboard/summary`, {
      headers: { Authorization: 'Bearer invalid-xyz' },
    });
    check(badTokenRes, {
      'invalid token returns 401': (r) => r.status === 401,
    });

    // Insufficient permissions
    const forbiddenRes = http.get(`${BASE_URL}/api/v1/admin/users`, {
      headers: { Authorization: `Bearer ${tokens.creator}` },
    });
    check(forbiddenRes, {
      'insufficient permissions returns 403': (r) => r.status === 403,
    });
    sleep(0.5);
  });

  sleep(1);
}

// Custom summary function for detailed metrics
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    [`./load-test/results-${Date.now()}.json`]: data,
  };
}

// Simple text summary
function textSummary(data, options) {
  const summary = [];
  summary.push('\n╔════════════════════════════════════════════════════════════════╗');
  summary.push('║           k6 Load Test Summary — YouTube OS                     ║');
  summary.push('╚════════════════════════════════════════════════════════════════╝\n');

  if (data.metrics) {
    const httpReqDuration = data.metrics.http_req_duration;
    const httpReqFailed = data.metrics.http_req_failed;

    if (httpReqDuration && httpReqDuration.values) {
      summary.push('📊 Response Times:');
      summary.push(`  • Min:  ${Math.round(httpReqDuration.values.min)}ms`);
      summary.push(`  • Max:  ${Math.round(httpReqDuration.values.max)}ms`);
      summary.push(`  • Avg:  ${Math.round(httpReqDuration.values.avg)}ms`);
      if (httpReqDuration.values['p(95)'] !== undefined) {
        summary.push(`  • p95:  ${Math.round(httpReqDuration.values['p(95)'])}ms`);
      }
      if (httpReqDuration.values['p(99)'] !== undefined) {
        summary.push(`  • p99:  ${Math.round(httpReqDuration.values['p(99)'])}ms`);
      }
      summary.push('');
    }

    if (httpReqFailed && httpReqFailed.values) {
      summary.push('❌ Error Rates:');
      summary.push(`  • Failed: ${(httpReqFailed.values.rate * 100).toFixed(2)}%`);
      summary.push(`  • Count:  ${Math.round(httpReqFailed.values.count)}`);
      summary.push('');
    }

    if (data.metrics.checks && data.metrics.checks.values) {
      summary.push('✅ Checks:');
      summary.push(`  • Passed: ${(data.metrics.checks.values.rate * 100).toFixed(2)}%`);
      summary.push('');
    }
  }

  summary.push('Duration: ' + formatDuration(data.duration || 0));
  summary.push('');

  return summary.join('\n');
}

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}
