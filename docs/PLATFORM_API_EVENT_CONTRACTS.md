# Platform API and Event Contract Registry

Sprint: `AAT-YTOS-SPRINT-0.0.5`. This registry is read-only and derived only from files in this repository. It performs no network request and authorizes no runtime integration.

## API Contract Registry

Platform-owned API records come from the verified GET inventory in `governance/platform-boundary-registry.v1.json` and their route source files. The consumed Global API record comes from `contracts/api/global-ecosystem-api.v1.json`, which is explicitly a `NOT_VERIFIED` compatibility placeholder rather than an authoritative Global contract.

## Event Contract Registry

The platform-owned event registry is empty because the boundary registry contains no published events. The consumed Global event record comes from `contracts/events/global-ecosystem-events.v1.json` and remains a non-authoritative `NOT_VERIFIED` placeholder.

## API Version Matrix

Repository routes and local contracts use the `v1` contract namespace. Owned GET contracts are active and repository-verified. Consumed placeholders are version-discovered but blocked pending authoritative contracts.

## Compatibility Validation

Validation checks duplicate IDs, version agreement, lifecycle/ownership agreement, lifecycle/compatibility agreement, repository evidence completeness, and this documentation. `BLOCKED_MISSING_AUTHORITATIVE_CONTRACT` is preserved for consumed placeholders; no compatibility is inferred.

## Lifecycle Rules

- `ACTIVE`: an owned contract evidenced by an implemented local GET route.
- `PLACEHOLDER`: a consumed local compatibility document that is not authoritative.

## Compatibility Rules

- `VERIFIED`: local owned route evidence exists.
- `BLOCKED_MISSING_AUTHORITATIVE_CONTRACT`: local placeholder exists, but governing contract evidence is unavailable.

No write API, public event publication, external provider, database model, outbound destination, or business runtime is introduced.