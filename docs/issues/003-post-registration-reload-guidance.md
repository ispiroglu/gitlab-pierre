# Post-registration reload guidance

**Type:** AFK  
**Triage (when publishing):** `ready-for-agent`

## Parent

https://github.com/Stanzilla/gitlab-pierre/issues/8

## What to build

Complete the **post-registration activation** UX: Pierre never auto-reloads the tab after a successful register.

- After register succeeds, if the active tab is already a **changes page** on that instance, the popup shows brief guidance that a reload is needed plus an optional **reload tab** control.
- If the active tab is not a changes page, rely on normal navigation/refresh (no reload prompt required).
- The extension must not reload any tab unless the user explicitly uses the reload control.

## Acceptance criteria

- [ ] Successful registration never triggers an automatic tab reload.
- [ ] When the active tab is a supported changes page on the newly registered instance, the popup offers optional reload guidance and a reload control.
- [ ] Using the reload control refreshes only the active tab; Pierre injects on the refreshed changes page.
- [ ] When the active tab is not a changes page, no misleading “reload now” requirement—user can navigate when ready.

## Blocked by

- [001 — Core instance pool registration](./001-core-instance-pool-registration.md)

## User stories covered

11, 12
