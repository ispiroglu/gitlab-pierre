# Changes-page detection extraction

**Type:** AFK  
**Triage (when publishing):** `ready-for-agent`

## Parent

https://github.com/Stanzilla/gitlab-pierre/issues/8

## What to build

Extract supported **changes page** recognition from the monolithic content entry into a dedicated deep module so merge request diffs, commit, and compare URLs can be tested in isolation.

- Module answers whether the current `location.pathname` is a supported changes page and returns the structured page kind / keys the renderer already expects.
- Wire the content script to use the module without changing user-visible behavior on GitLab.com or on registered self-hosted instances.
- Add unit tests for MR diffs, commit, and compare path shapes (including nested **project path** prefixes of varying depth).

No change to registration, pool, or popup in this slice.

## Acceptance criteria

- [ ] Changes-page detection lives in a standalone module with a simple, stable interface.
- [ ] Unit tests cover merge request diffs, commit, and compare pathname patterns (including deep project paths).
- [ ] GitLab.com changes pages behave as before.
- [ ] Registered self-hosted instances behave as before on the same path shapes.
- [ ] No regression in which pages Pierre activates on.

## Blocked by

- [001 — Core instance pool registration](./001-core-instance-pool-registration.md)

## User stories covered

9, 10, 27
