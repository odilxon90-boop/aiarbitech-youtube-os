#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
SMOKE_USER="${SMOKE_USER:-smoke@youtube-os.test}"
SMOKE_PASS="${SMOKE_PASS:-SmokeTestPassword!}"

request() {
  curl --fail --silent --show-error "$@"
}

echo "Running smoke tests against ${BASE_URL}..."

# Health checks
request "${BASE_URL}/health" >/dev/null
request "${BASE_URL}/health/db" >/dev/null
request "${BASE_URL}/health/cache" >/dev/null

# Auth
login_response="$(request --request POST "${BASE_URL}/api/v1/auth/login" \
  --header "Content-Type: application/json" \
  --data "{\"email\":\"${SMOKE_USER}\",\"password\":\"${SMOKE_PASS}\"}")"
access_token="$(printf '%s' "${login_response}" | node -e '
  let body = "";
  process.stdin.on("data", (chunk) => { body += chunk; });
  process.stdin.on("end", () => {
    const token = JSON.parse(body).data?.token;
    if (typeof token !== "string" || token.length === 0) process.exit(1);
    process.stdout.write(token);
  });
')"

auth_header="Authorization: Bearer ${access_token}"

# Core endpoints
request --header "${auth_header}" "${BASE_URL}/api/v1/dashboard/summary" >/dev/null
request --request POST "${BASE_URL}/api/v1/ai/chat/send" \
  --header "Content-Type: application/json" \
  --header "${auth_header}" \
  --data '{"message":"hello"}' >/dev/null
request --header "${auth_header}" "${BASE_URL}/api/v1/analytics/overview" >/dev/null

echo "ALL TESTS PASSED - Safe to proceed"
