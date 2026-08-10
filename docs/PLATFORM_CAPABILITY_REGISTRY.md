# Platform Capability Registry

Sprint: `AAT-YTOS-SPRINT0.0.2`

`governance/capability-registry.v1.json` remains the single authoritative, versioned, repository-owned capability source. Sprint 0.0.2 upgrades its record shape in place; it does not create a parallel registry.

The existing fixed-map loader validates the registry with the capability-specific Zod schema and recursively freezes it. The backend exposes only `GET` routes for the complete registry, summary, validation result, and details by capability ID. The existing application shell renders the complete registry without editing, activation, or execution controls.

`FOUNDATION_GOVERNANCE` is preserved as implemented and verified from local repository evidence. Shared Global Ecosystem dependencies and all YouTube business capabilities remain `NOT_IMPLEMENTED`. Unknown contract versions and unknown dependency details remain `NOT_VERIFIED`. No external request, database persistence, Prisma model, migration, runtime capability, OAuth, YouTube API, or business behavior is introduced.