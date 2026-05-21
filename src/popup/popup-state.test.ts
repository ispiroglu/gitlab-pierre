import { describe, expect, it } from "vitest";
import { POPUP_TOP_STATE, resolvePopupTopState } from "./popup-state";
import { REGISTRABILITY_REASON } from "../registrability/registrability";

const SELF_HOSTED_ORIGIN = "https://gitlab.example.com";

describe("resolvePopupTopState", () => {
	it("returns non-gitlab when tab is not registrable", () => {
		expect(
			resolvePopupTopState({
				activeTabRegistrability: {
					registrable: false,
					reason: REGISTRABILITY_REASON.MISSING_GITLAB_ROUTE,
				},
				activeTabInPool: false,
			}),
		).toBe(POPUP_TOP_STATE.NON_GITLAB);
	});

	it("returns non-gitlab for built-in GitLab.com tab", () => {
		expect(
			resolvePopupTopState({
				activeTabRegistrability: {
					registrable: false,
					reason: REGISTRABILITY_REASON.BUILT_IN_INSTANCE,
				},
				activeTabInPool: false,
			}),
		).toBe(POPUP_TOP_STATE.NON_GITLAB);
	});

	it("returns unregistered prompt for registrable self-hosted not in pool", () => {
		expect(
			resolvePopupTopState({
				activeTabRegistrability: {
					registrable: true,
					origin: SELF_HOSTED_ORIGIN,
				},
				activeTabInPool: false,
			}),
		).toBe(POPUP_TOP_STATE.UNREGISTERED_INSTANCE_PROMPT);
	});

	it("returns already registered for registrable self-hosted in pool", () => {
		expect(
			resolvePopupTopState({
				activeTabRegistrability: {
					registrable: true,
					origin: SELF_HOSTED_ORIGIN,
				},
				activeTabInPool: true,
			}),
		).toBe(POPUP_TOP_STATE.ALREADY_REGISTERED_STATUS);
	});

	it("returns non-gitlab when registrability is unknown", () => {
		expect(
			resolvePopupTopState({
				activeTabRegistrability: null,
				activeTabInPool: false,
			}),
		).toBe(POPUP_TOP_STATE.NON_GITLAB);
	});
});
