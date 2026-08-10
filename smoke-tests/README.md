# Post-Deployment Smoke Tests — YouTube OS

Automated smoke tests that verify critical platform functionality immediately after deployment. All tests must pass before a deployment is declared successful.

## Usage

```bash
# Run all smoke tests
./smoke-tests/test.sh

# Run individual suites
./smoke-tests/health.sh
./smoke-tests/auth.sh
./smoke-tests/core.sh
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Backend API base URL |
| `SMOKE_USER` | `smoke@youtube-os.test` | Test user email |
| `SMOKE_PASS` | *(required)* | Test user password |
| `TIMEOUT` | `10` | Request timeout in seconds |

Set via environment or a `.env.smoke` file (never commit credentials):

```bash
export BASE_URL=https://staging-api.youtube-os.aiarbitech.com
export SMOKE_USER=smoke@youtube-os.test
export SMOKE_PASS=your-smoke-test-password
./smoke-tests/test.sh
```

## Test Suites

| Suite | File | Tests | Description |
|---|---|---|---|
| Health | `health.sh` | 3 | API, database, Redis connectivity |
| Auth | `auth.sh` | 2 | Login flow and token issuance |
| Core | `core.sh` | 4 | Dashboard, AI assistant, video studio |

## Exit Codes

- `0` — All tests passed
- `1` — One or more tests failed

Any non-zero exit from `test.sh` must trigger a rollback or immediate investigation before the deployment is accepted.
