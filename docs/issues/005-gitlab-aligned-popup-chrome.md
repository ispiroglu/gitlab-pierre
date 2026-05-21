# GitLab-aligned popup chrome (v1)

**Type:** AFK  
**Triage (when publishing):** `ready-for-agent`

## Parent

https://github.com/Stanzilla/gitlab-pierre/issues/8

## What to build

Apply **GitLab-aligned extension chrome** to the toolbar popup only (v1 scope: **popup-only chrome alignment**).

- Use **standard GitLab chrome styling** from design resources shipped with the extension—not styles read from the active GitLab tab.
- **Fixed light popup chrome** always (ignore OS / GitLab tab dark mode).
- Polish **split instance labeling:** hostname only in the instance list rows; full origin in the active-tab status header (unregistered prompt, registered status, reload guidance).
- Built-in GitLab.com row visually consistent with self-hosted rows (always on, no minus).
- In-page Pierre diff UI, settings panel, return control, and toasts stay as today.

## Acceptance criteria

- [ ] Popup typography, color, spacing, and controls align with GitLab product visual language using bundled assets.
- [ ] Popup remains light mode in all environments.
- [ ] Instance list rows show hostname only; active-tab callouts show full origin.
- [ ] Popup states from issue 002 still render correctly with the new chrome.
- [ ] No attempt to sync theme from the active GitLab tab.
- [ ] In-page Pierre UI appearance unchanged.

## Blocked by

- [002 — Popup context states & registrability gating](./002-popup-context-states-registrability.md)

## User stories covered

21, 22, 24, 25
