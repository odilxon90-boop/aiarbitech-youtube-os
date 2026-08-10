#!/usr/bin/env bash
# smoke-tests/health.sh — Verify health check endpoints
# Tests: /health, /health/db, /health/cache

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_lib.sh"

suite "Health Checks"

# ─── Test 1: API health ───────────────────────────────────────────────────────

test_start "API health endpoint responds 200"

response=$(http_get "/api/v1/health")
status=$(echo "$response" | jq -r '.status // empty' 2>/dev/null)

if [[ "$status" == "ok" || "$status" == "healthy" ]]; then
  test_pass "GET /api/v1/health → status: $status"
else
  test_fail "GET /api/v1/health → unexpected body: $response"
fi

# ─── Test 2: Database health ─────────────────────────────────────────────────

test_start "Database connectivity"

response=$(http_get "/api/v1/health/db")
db_status=$(echo "$response" | jq -r '.database // .db // .status // empty' 2>/dev/null)

if [[ "$db_status" == "ok" || "$db_status" == "healthy" || "$db_status" == "connected" ]]; then
  test_pass "GET /api/v1/health/db → database: $db_status"
else
  test_fail "GET /api/v1/health/db → unexpected body: $response"
fi

# ─── Test 3: Redis / cache health ────────────────────────────────────────────

test_start "Redis cache connectivity"

response=$(http_get "/api/v1/health/cache")
cache_status=$(echo "$response" | jq -r '.cache // .redis // .status // empty' 2>/dev/null)

if [[ "$cache_status" == "ok" || "$cache_status" == "healthy" || "$cache_status" == "connected" ]]; then
  test_pass "GET /api/v1/health/cache → cache: $cache_status"
else
  test_fail "GET /api/v1/health/cache → unexpected body: $response"
fi

suite_summary
