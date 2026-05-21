# Implementation issues (instance pool)

Tracer-bullet issues for self-hosted GitLab support. **Published on** [ispiroglu/gitlab-pierre](https://github.com/ispiroglu/gitlab-pierre/issues). Upstream parent: [Stanzilla/gitlab-pierre#8](https://github.com/Stanzilla/gitlab-pierre/issues/8).

**Triage label:** `ready-for-agent`

**Dependency order:** #1 → #2, #3, #4 → #5 (#5 also needs #2)

| GitHub                                                    | Local doc                                           | Title                                        | Blocked by |
| --------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------- | ---------- |
| [#1](https://github.com/ispiroglu/gitlab-pierre/issues/1) | [001](./001-core-instance-pool-registration.md)     | Core instance pool registration              | —          |
| [#2](https://github.com/ispiroglu/gitlab-pierre/issues/2) | [002](./002-popup-context-states-registrability.md) | Popup context states & registrability gating | #1         |
| [#3](https://github.com/ispiroglu/gitlab-pierre/issues/3) | [004](./004-changes-page-detection-extraction.md)   | Changes-page detection extraction            | #1         |
| [#4](https://github.com/ispiroglu/gitlab-pierre/issues/4) | [003](./003-post-registration-reload-guidance.md)   | Post-registration reload guidance            | #1         |
| [#5](https://github.com/ispiroglu/gitlab-pierre/issues/5) | [005](./005-gitlab-aligned-popup-chrome.md)         | GitLab-aligned popup chrome (v1)             | #2         |

**Source:** `CONTEXT.md`, `response.md` (PRD), design session decisions.
