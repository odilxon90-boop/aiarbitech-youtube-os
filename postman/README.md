# YouTube OS Postman Collection

Import `collection.json` and `environment.json` into Postman, then select the **YouTube OS Local** environment. Run **Authentication → Login** first; its test script stores the returned access token in `auth_token`.

## Environment variables

| Variable | Purpose | Local default |
| --- | --- | --- |
| `base_url` | Backend origin, without `/api/v1` | `http://localhost:3100` |
| `auth_token` | JWT bearer token used by protected requests | Set automatically by Login |
| `refresh_token` | JWT refresh token | Set automatically by Login |
| `bootstrap_admin_password` | Local bootstrap admin password | `ChangeMeAdminPassword!` |
| `user_id` | Creator/user identifier used by workflow requests | `creator-001` |
| `channel_id` | Channel identifier available to channel-oriented requests | `channel-001` |
| `video_id` | Video identifier used by Quality Gate requests | `video-aurora` |
| `workflow_id` | Existing workflow identifier for status requests | `workflow-001` |

For production, set `base_url` to the production API origin. Do not include `/api/v1`, because the collection request paths already include it.

## Authentication

The collection applies `Authorization: Bearer {{auth_token}}` at the collection level. The backend verifies the HS256 JWT and reads permissions from its signed claims; `x-permissions` request headers are ignored.

For local development, login with the bootstrap credentials configured in `backend/.env`. Set a random `JWT_SECRET` with at least 32 characters and an `AUTH_BOOTSTRAP_ADMIN_PASSWORD` before running in production.
