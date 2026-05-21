import { describe, expect, it } from "vitest";
import { matchesPendingReloadPrompt } from "./pending-reload-origin";

const SELF_HOSTED_ORIGIN = "https://gitlab.example.com";

describe("matchesPendingReloadPrompt", () => {
	it("returns true when pending origin matches on a changes page", () => {
		expect(
			matchesPendingReloadPrompt(SELF_HOSTED_ORIGIN, SELF_HOSTED_ORIGIN, true),
		).toBe(true);
	});

	it("returns false when the active tab is not a changes page", () => {
		expect(
			matchesPendingReloadPrompt(SELF_HOSTED_ORIGIN, SELF_HOSTED_ORIGIN, false),
		).toBe(false);
	});

	it("returns false when there is no pending reload origin", () => {
		expect(matchesPendingReloadPrompt(null, SELF_HOSTED_ORIGIN, true)).toBe(
			false,
		);
	});

	it("returns false when pending origin does not match the active instance", () => {
		expect(
			matchesPendingReloadPrompt(
				"https://gitlab.other.com",
				SELF_HOSTED_ORIGIN,
				true,
			),
		).toBe(false);
	});
});
