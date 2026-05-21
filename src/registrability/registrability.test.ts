import { describe, expect, it } from "vitest";
import {
	getRegistrabilityForUrl,
	originToHostname,
	REGISTRABILITY_REASON,
} from "./registrability";

describe("registrability", () => {
	it("accepts HTTPS GitLab pages with /-/", () => {
		expect(
			getRegistrabilityForUrl(
				"https://gitlab.trendyol.com/group/project/-/merge_requests/1",
			),
		).toEqual({
			registrable: true,
			origin: "https://gitlab.trendyol.com",
		});
	});

	it("rejects HTTP tabs", () => {
		expect(
			getRegistrabilityForUrl(
				"http://gitlab.trendyol.com/group/-/merge_requests/1",
			),
		).toEqual({
			registrable: false,
			reason: REGISTRABILITY_REASON.NOT_HTTPS,
		});
	});

	it("rejects pages without GitLab route segment", () => {
		expect(
			getRegistrabilityForUrl("https://gitlab.trendyol.com/users/sign_in"),
		).toEqual({
			registrable: false,
			reason: REGISTRABILITY_REASON.MISSING_GITLAB_ROUTE,
		});
	});

	it("rejects built-in GitLab.com registration", () => {
		expect(
			getRegistrabilityForUrl(
				"https://gitlab.com/group/project/-/merge_requests/1",
			),
		).toEqual({
			registrable: false,
			reason: REGISTRABILITY_REASON.BUILT_IN_INSTANCE,
		});
	});

	it("maps origin to hostname for list labels", () => {
		expect(originToHostname("https://gitlab.trendyol.com")).toBe(
			"gitlab.trendyol.com",
		);
	});
});
