# Log Retention and Archiving Policy

## Retention schedule

| Log class | Hot searchable retention | Archive retention | Storage |
| --- | ---: | ---: | --- |
| Security and audit events | 90 days | 1 year | Loki then encrypted object storage |
| Backend, Nginx, database, Redis errors | 30 days | 180 days | Loki then encrypted object storage |
| Standard access and application logs | 30 days | 90 days | Loki then compressed object storage |
| Frontend client errors | 30 days | 90 days | Loki then compressed object storage |
| Debug logs | 7 days | None by default | Loki |

## Controls

1. Store archives in an encrypted bucket with lifecycle policies and least-privilege access.
2. Restrict log access because correlation IDs, user identifiers, and error payloads may be sensitive.
3. Do not log access tokens, refresh tokens, passwords, database URLs, or secrets.
4. Redact personal data not required for troubleshooting before shipment.
5. Review retention periods quarterly with security and legal owners.
6. Test archive restore and Grafana/Loki recovery at least quarterly.

## Deletion and exceptions

1. Loki compaction deletes expired hot data according to `retention_period`.
2. Object storage lifecycle rules delete expired archives automatically.
3. Legal hold or active incident evidence overrides automatic deletion only with documented approval.
4. Record retention-policy changes and archive restore operations in the operational audit log.
