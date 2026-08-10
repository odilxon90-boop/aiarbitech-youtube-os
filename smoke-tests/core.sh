#!/usr/bin/env bash
# smoke-tests/core.sh — Verify core platform functionality
# Tests: Dashboard, AI Assistant, Video Studio
# Requires: SMOKE_TOKEN set by auth.sh (or re-login below)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_lib.sh"

suite "Core Functionality"

# ─── Ensure we have an auth token ────────────────────────────────────────────

if [[ -z "${SMOKE_TOKEN:-}" ]]; then
  log_info "SMOKE_TOKEN not set — performing login to obtain token"

  login_body=$(jq -n \
    --arg email "${SMOKE_USER}" \
    --arg password "${SMOKE_PASS}" \
    '{"email": $email, "password": $password}')

  login_response=$(http_post "/api/v1/auth/login" "$login_body")
  SMOKE_TOKEN=$(echo "$login_response" | jq -r '.token // .accessToken // .access_token // empty' 2>/dev/null)

  if [[ -z "$SMOKE_TOKEN" || "$SMOKE_TOKEN" == "null" ]]; then
    fatal "Cannot run core smoke tests — login failed: $login_response"
  fi

  log_info "Token obtained for core tests"
fi

# ─── Test 5: Dashboard summary ───────────────────────────────────────────────

test_start "Dashboard summary returns data"

response=$(http_get_auth "/api/v1/dashboard/summary" "$SMOKE_TOKEN")
has_data=$(echo "$response" | jq 'type == "object" and (keys | length) > 0' 2>/dev/null)

if [[ "$has_data" == "true" ]]; then
  test_pass "GET /api/v1/dashboard/summary → data object returned"
else
  test_fail "GET /api/v1/dashboard/summary → unexpected response: $response"
fi

# ─── Test 6: AI Assistant chat ────────────────────────────────────────────────

test_start "AI Assistant returns a response"

chat_body=$(jq -n '{"message": "What content should I create today? (smoke test)"}')

response=$(http_post_auth "/api/v1/ai/chat/send" "$chat_body" "$SMOKE_TOKEN")
has_reply=$(echo "$response" | jq \
  '.response != null or .reply != null or .message != null or .content != null' 2>/dev/null)

if [[ "$has_reply" == "true" ]]; then
  test_pass "POST /api/v1/ai/chat/send → response field present"
else
  test_fail "POST /api/v1/ai/chat/send → unexpected response: $response"
fi

# ─── Test 7: Video ideas list ─────────────────────────────────────────────────

test_start "Video Studio returns video ideas list"

response=$(http_get_auth "/api/v1/video/ideas" "$SMOKE_TOKEN")
is_array=$(echo "$response" | jq 'type == "array" or (.data | type) == "array" or (.ideas | type) == "array"' 2>/dev/null)

if [[ "$is_array" == "true" ]]; then
  count=$(echo "$response" | jq '
    if type == "array" then length
    elif .data | type == "array" then .data | length
    elif .ideas | type == "array" then .ideas | length
    else 0 end' 2>/dev/null)
  test_pass "GET /api/v1/video/ideas → list returned ($count items)"
else
  test_fail "GET /api/v1/video/ideas → expected array, got: $response"
fi

# ─── Test 8: Metrics endpoint accessible ─────────────────────────────────────

test_start "Prometheus /metrics endpoint is accessible"

http_code=$(curl -s -o /dev/null -w "%{http_code}" \
  --max-time "${TIMEOUT:-10}" \
  "${BASE_URL}/metrics")

if [[ "$http_code" == "200" ]]; then
  test_pass "GET /metrics → HTTP 200"
else
  test_fail "GET /metrics → expected 200, got $http_code"
fi

suite_summary
