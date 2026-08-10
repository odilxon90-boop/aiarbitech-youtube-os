#!/usr/bin/env bash
# smoke-tests/_lib.sh — Shared helpers for smoke test scripts
# Sourced by health.sh, auth.sh, core.sh, test.sh

# ─── Configuration ───────────────────────────────────────────────────────────

BASE_URL="${BASE_URL:-http://localhost:3000}"
SMOKE_USER="${SMOKE_USER:-smoke@youtube-os.test}"
SMOKE_PASS="${SMOKE_PASS:?'SMOKE_PASS is required — set it as an environment variable'}"
TIMEOUT="${TIMEOUT:-10}"

# ─── Counters ────────────────────────────────────────────────────────────────

SUITE_NAME=""
SUITE_PASSED=0
SUITE_FAILED=0

# Global totals (accumulated across suites when run from test.sh)
TOTAL_PASSED="${TOTAL_PASSED:-0}"
TOTAL_FAILED="${TOTAL_FAILED:-0}"

# ─── Colors ──────────────────────────────────────────────────────────────────

if [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  RED='' GREEN='' YELLOW='' CYAN='' BOLD='' RESET=''
fi

# ─── Output helpers ──────────────────────────────────────────────────────────

suite() {
  SUITE_NAME="$1"
  SUITE_PASSED=0
  SUITE_FAILED=0
  echo ""
  echo -e "${CYAN}${BOLD}━━━ $SUITE_NAME ━━━${RESET}"
}

test_start() {
  echo -e "  ${YELLOW}▸${RESET} $1"
}

test_pass() {
  SUITE_PASSED=$((SUITE_PASSED + 1))
  TOTAL_PASSED=$((TOTAL_PASSED + 1))
  echo -e "    ${GREEN}✓ PASS${RESET}  $1"
}

test_fail() {
  SUITE_FAILED=$((SUITE_FAILED + 1))
  TOTAL_FAILED=$((TOTAL_FAILED + 1))
  echo -e "    ${RED}✗ FAIL${RESET}  $1" >&2
}

log_info() {
  echo -e "  ${YELLOW}ℹ${RESET}  $1"
}

fatal() {
  echo -e "${RED}${BOLD}FATAL:${RESET} $1" >&2
  exit 1
}

suite_summary() {
  local total=$((SUITE_PASSED + SUITE_FAILED))
  if [[ $SUITE_FAILED -eq 0 ]]; then
    echo -e "  ${GREEN}${BOLD}Suite result: $SUITE_PASSED/$total passed${RESET}"
  else
    echo -e "  ${RED}${BOLD}Suite result: $SUITE_FAILED/$total FAILED${RESET}" >&2
  fi
  # Return non-zero if any tests failed (allows set -e to catch failures in test.sh)
  return $SUITE_FAILED
}

# ─── HTTP helpers ─────────────────────────────────────────────────────────────

# GET request — returns response body (exits on non-2xx)
http_get() {
  local path="$1"
  local url="${BASE_URL}${path}"
  local http_code body

  body=$(curl -s -w "\n%{http_code}" \
    --max-time "${TIMEOUT}" \
    -H "Accept: application/json" \
    "$url")

  http_code=$(echo "$body" | tail -n1)
  body=$(echo "$body" | head -n -1)

  if [[ "$http_code" -lt 200 || "$http_code" -ge 300 ]]; then
    echo "HTTP $http_code: $body"
    return 1
  fi

  echo "$body"
}

# POST request — returns response body
http_post() {
  local path="$1"
  local data="$2"
  local url="${BASE_URL}${path}"
  local http_code body

  body=$(curl -s -w "\n%{http_code}" \
    --max-time "${TIMEOUT}" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "$data" \
    "$url")

  http_code=$(echo "$body" | tail -n1)
  body=$(echo "$body" | head -n -1)

  echo "$body"
}

# GET request with Bearer token — returns response body
http_get_auth() {
  local path="$1"
  local token="$2"
  local url="${BASE_URL}${path}"
  local http_code body

  body=$(curl -s -w "\n%{http_code}" \
    --max-time "${TIMEOUT}" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer ${token}" \
    "$url")

  http_code=$(echo "$body" | tail -n1)
  body=$(echo "$body" | head -n -1)

  if [[ "$http_code" -lt 200 || "$http_code" -ge 300 ]]; then
    echo "HTTP $http_code: $body"
    return 1
  fi

  echo "$body"
}

# POST request with Bearer token — returns response body
http_post_auth() {
  local path="$1"
  local data="$2"
  local token="$3"
  local url="${BASE_URL}${path}"
  local http_code body

  body=$(curl -s -w "\n%{http_code}" \
    --max-time "${TIMEOUT}" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer ${token}" \
    -d "$data" \
    "$url")

  http_code=$(echo "$body" | tail -n1)
  body=$(echo "$body" | head -n -1)

  echo "$body"
}

# Return just the HTTP status code for a request
http_status() {
  local path="$1"
  local method="${2:-GET}"
  local data="${3:-}"
  local url="${BASE_URL}${path}"

  curl -s -o /dev/null -w "%{http_code}" \
    --max-time "${TIMEOUT}" \
    -X "$method" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    ${data:+-d "$data"} \
    "$url"
}

# ─── Dependency check ────────────────────────────────────────────────────────

check_deps() {
  local missing=0
  for cmd in curl jq; do
    if ! command -v "$cmd" &>/dev/null; then
      echo -e "${RED}Missing required command: $cmd${RESET}" >&2
      missing=1
    fi
  done
  if [[ $missing -eq 1 ]]; then
    fatal "Install missing dependencies and re-run."
  fi
}
