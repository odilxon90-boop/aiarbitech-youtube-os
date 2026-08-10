#!/usr/bin/env bash
# smoke-tests/auth.sh — Verify authentication flow
# Tests: POST /auth/login (success), POST /auth/login (failure)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_lib.sh"

suite "Authentication"

# ─── Test 4: Login returns token ─────────────────────────────────────────────

test_start "Login with valid credentials returns token"

login_body=$(jq -n \
  --arg email "${SMOKE_USER}" \
  --arg password "${SMOKE_PASS}" \
  '{"email": $email, "password": $password}')

response=$(http_post "/api/v1/auth/login" "$login_body")
token=$(echo "$response" | jq -r '.token // .accessToken // .access_token // empty' 2>/dev/null)

if [[ -n "$token" && "$token" != "null" ]]; then
  # Export token for use by downstream suites
  export SMOKE_TOKEN="$token"
  # Write token to temp file so parent test.sh can re-export across subshells
  echo -n "$token" > "/tmp/.smoke_token_$$"
  test_pass "POST /api/v1/auth/login → token issued (${#token} chars)"
else
  test_fail "POST /api/v1/auth/login → no token in response: $response"
fi

# ─── Test 5: Invalid credentials returns 401 ─────────────────────────────────

test_start "Login with invalid credentials returns 401"

bad_body=$(jq -n \
  --arg email "${SMOKE_USER}" \
  '{"email": $email, "password": "wrong-password-smoke-test"}')

http_code=$(http_status "/api/v1/auth/login" "POST" "$bad_body")

if [[ "$http_code" == "401" ]]; then
  test_pass "POST /api/v1/auth/login (bad creds) → HTTP 401"
else
  test_fail "POST /api/v1/auth/login (bad creds) → expected 401, got $http_code"
fi

suite_summary
