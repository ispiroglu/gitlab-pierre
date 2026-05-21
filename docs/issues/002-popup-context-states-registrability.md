# Popup context states & registrability gating

**Type:** AFK  
**Triage (when publishing):** `ready-for-agent`

## Parent

https://github.com/Stanzilla/gitlab-pierre/issues/8

## What to build

Refine the toolbar popup so it reflects **where the user is** and **whether registration is allowed**, using a small popup state machine driven by active-tab context plus pool membership.

- **Registrability:** Only offer **Register instance** when the active tab is HTTPS and the pathname contains GitLab's `/-/` routing segment. Otherwise disable Register with a short English explanation (not a changes page required—any `/-/` GitLab page is enough).
- **Unregistered instance prompt:** On a registrable self-hosted tab whose origin is not in the pool, lead with a prominent Register action and show the full origin in the header area (**split instance labeling** for the active tab).
- **Already registered status:** On a registrable self-hosted tab already in the pool, show a brief Registered status (no Register button); instance list below unchanged.
- **Non-GitLab popup view:** On tabs that are not registrable GitLab pages, show only the instance list (built-in + pooled)—no Register control and no explanatory note.
- **Registration denial:** Remains a clean no-op (no partial pool entry).
- **Extension copy:** All popup strings in English.

Project path depth on the host does not affect registrability—only origin and HTTPS/`/-/` rules matter.

## Acceptance criteria

- [ ] Register is enabled only on HTTPS GitLab pages with `/-/` in the pathname; disabled elsewhere with clear English copy.
- [ ] Self-hosted registrable tab not in pool shows **unregistered instance prompt** with full origin and Register.
- [ ] Self-hosted registrable tab already in pool shows **already registered status** without Register.
- [ ] Non-GitLab active tab shows **non-GitLab popup view** (list only).
- [ ] Popup state resolution logic is covered by unit tests (tab context + pool → expected top state).
- [ ] Denying host permission does not add the origin to the pool.

## Blocked by

- [001 — Core instance pool registration](./001-core-instance-pool-registration.md)

## User stories covered

7, 17, 18, 19, 23, 28
