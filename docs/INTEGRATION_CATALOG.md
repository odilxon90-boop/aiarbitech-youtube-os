# Integration Catalog

This catalog lists YouTube OS external integrations and their current governance-aligned state.

## Integration List

| Integration Name | Global Ecosystem Service or External Provider | Connection Mode | Status | Note |
|---|---|---|---|---|
| Global Identity | Global Ecosystem Identity / AuthN / AuthZ / RBAC-ABAC | API | BLOCKED | Declared dependency exists, but authoritative production contract is not yet available. |
| Global Security | Global Ecosystem Security | API | BLOCKED | Security capability is Global-owned; local replacement is prohibited; integration remains contract-gated. |
| Global AI Core | Global Ecosystem AI Core | API | BLOCKED | AI inference must be consumed from Global boundary only after approved versioned contract activation. |
| Payment Infrastructure | Global Ecosystem Billing / Subscription / Payments | Shared Service | BLOCKED | Financial infrastructure is centralized globally; no local payment stack is allowed. |
| Wallet Infrastructure | Global Ecosystem Global Wallet / Financial Infrastructure | Shared Service | BLOCKED | Single Global Wallet model applies; platform wallet implementation is prohibited. |
| Audit Service | Global Ecosystem Audit | API and Event | BLOCKED | Audit submit path is declared boundary intent; authoritative runtime contract is not available yet. |
| Notification Service | Global Ecosystem Notifications | API and Event | BLOCKED | Notification delivery remains Global-owned; local engine duplication is prohibited. |
| Legal OS | External platform (cross-platform integration target) | API or Event | PENDING | No approved integration contract is registered yet in current repository evidence. |
| Growth OS | External platform (cross-platform integration target) | API or Event | PENDING | Future cross-platform integration requires approved, authenticated, versioned boundary contract. |
| Creator OS | External platform (cross-platform integration target) | API or Event | PENDING | Not activated in current foundation runtime; requires formal approval and contract registration. |

## Notes

- Direct database access and shared Prisma usage across platforms are prohibited.
- Unversioned or unauthenticated cross-platform calls are prohibited.
- Integration status is based on current architecture and boundary governance artifacts.