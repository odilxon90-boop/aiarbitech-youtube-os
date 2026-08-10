#!/usr/bin/env bash
<<<<<<< HEAD
# smoke-tests/test.sh — Post-deployment smoke test runner
#
# Runs all smoke test suites in order. Exits 0 if all pass, 1 if any fail.
#
# Usage:
#   ./smoke-tests/test.sh
#   BASE_URL=https://staging-api.youtube-os.aiarbitech.com \
#   SMOKE_USER=smoke@youtube-os.test \
#   SMOKE_PASS=secret \
#   ./smoke-tests/test.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Load shared lib (for colors + dep check) ────────────────────────────────

source "${SCRIPT_DIR}/_lib.sh"

# ─── Banner ──────────────────────────────────────────────────────────────────

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║   YouTube OS — Post-Deployment Smoke     ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo -e "  Target:  ${CYAN}${BASE_URL}${RESET}"
echo -e "  User:    ${CYAN}${SMOKE_USER}${RESET}"
echo -e "  Started: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# ─── Preflight checks ────────────────────────────────────────────────────────

check_deps

echo ""
echo -e "${YELLOW}Waiting for backend to be reachable...${RESET}"

max_retries=12   # 12 × 5s = 60s max wait
retries=0

until curl -sf --max-time 3 "${BASE_URL}/api/v1/health" >/dev/null 2>&1; do
  retries=$((retries + 1))
  if [[ $retries -ge $max_retries ]]; then
    fatal "Backend at ${BASE_URL} did not respond after ${max_retries} retries. Aborting smoke tests."
  fi
  echo -e "  Retry $retries/$max_retries — waiting 5s..."
  sleep 5
done

echo -e "  ${GREEN}Backend reachable.${RESET}"

# ─── Export shared token slot ────────────────────────────────────────────────

export SMOKE_TOKEN=""
export TOTAL_PASSED=0
export TOTAL_FAILED=0

# ─── Run suites ──────────────────────────────────────────────────────────────

# Health suite — sets baseline for all other tests
bash "${SCRIPT_DIR}/health.sh"
health_exit=$?

# Auth suite — sets SMOKE_TOKEN for core tests
bash "${SCRIPT_DIR}/auth.sh"
auth_exit=$?

# Re-export token set by auth.sh (subshell can't propagate exports directly)
# auth.sh writes the token to a temp file so core.sh can read it
if [[ -f "/tmp/.smoke_token_$$" ]]; then
  export SMOKE_TOKEN="$(cat /tmp/.smoke_token_$$)"
  rm -f "/tmp/.smoke_token_$$"
fi

# Core suite — requires a valid token
bash "${SCRIPT_DIR}/core.sh"
core_exit=$?

# ─── Final summary ───────────────────────────────────────────────────────────

total=$((TOTAL_PASSED + TOTAL_FAILED))

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║            Smoke Test Results            ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo -e "  Finished: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo ""

if [[ $TOTAL_FAILED -eq 0 ]]; then
  echo -e "  ${GREEN}${BOLD}✓  ALL TESTS PASSED  ($TOTAL_PASSED/$total)${RESET}"
  echo ""
  echo -e "  ${GREEN}Deployment is HEALTHY. Safe to proceed.${RESET}"
  echo ""
  exit 0
else
  echo -e "  ${RED}${BOLD}✗  $TOTAL_FAILED TEST(S) FAILED  ($TOTAL_PASSED/$total passed)${RESET}" >&2
  echo ""
  echo -e "  ${RED}${BOLD}⚠  DEPLOYMENT IS NOT HEALTHY — ROLLBACK OR INVESTIGATE.${RESET}" >&2
  echo ""
  exit 1
fi
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
