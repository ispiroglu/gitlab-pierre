import { describe, expect, it } from "vitest";
import { getChangesPage } from "./changes-page";

describe("getChangesPage", () => {
	it("detects merge request diffs with deep project path", () => {
		const location = {
			pathname: "/org/platform/backend/-/merge_requests/42/diffs",
			search: "?view=parallel",
		};
		expect(getChangesPage(location)).toEqual({
			diffUrl: "/org/platform/backend/-/merge_requests/42.diff",
			key: "/org/platform/backend/-/merge_requests/42?view=parallel",
			kind: "merge-request",
		});
	});

	it("detects commit pages with deep project path", () => {
		const location = {
			pathname: "/a/b/c/d/-/commit/abcdef1234567890",
			search: "",
		};
		expect(getChangesPage(location)).toEqual({
			diffUrl: "/a/b/c/d/-/commit/abcdef1234567890.diff",
			key: "/a/b/c/d/-/commit/abcdef1234567890",
			kind: "commit",
		});
	});

	it("detects compare pages with deep project path", () => {
		const location = {
			pathname: "/team/app/-/compare/main...feature",
			search: "?from_project_id=1",
		};
		expect(getChangesPage(location)).toEqual({
			diffUrl: "/team/app/-/compare/main...feature.diff?from_project_id=1",
			key: "/team/app/-/compare/main...feature?from_project_id=1",
			kind: "compare",
		});
	});

	it("returns null for non-changes GitLab pages", () => {
		expect(
			getChangesPage({
				pathname: "/group/project/-/merge_requests/1",
				search: "",
			}),
		).toBeNull();
	});

	it("returns null for unrelated paths", () => {
		expect(
			getChangesPage({ pathname: "/users/sign_in", search: "" }),
		).toBeNull();
	});
});
