export type GitLabChangesPage =
	| { diffUrl: string; key: string; kind: "merge-request" }
	| { diffUrl: string; key: string; kind: "commit" }
	| { diffUrl: string; key: string; kind: "compare" };

export type ChangesPageLocation = Pick<Location, "pathname" | "search">;

const MERGE_REQUEST_DIFFS_PATH_PATTERN =
	/^(.*\/-\/merge_requests\/\d+)\/diffs\/?$/;

const COMMIT_PATH_PATTERN = /^(.*\/-\/commit\/[0-9a-f]{7,40})\/?$/i;

const COMPARE_PATH_PATTERN = /^(.*\/-\/compare\/[^/]+)\/?$/;

export function getChangesPage(
	location: ChangesPageLocation,
): GitLabChangesPage | null {
	const path = location.pathname;

	const mergeRequestMatch = path.match(MERGE_REQUEST_DIFFS_PATH_PATTERN);
	if (mergeRequestMatch?.[1] != null) {
		return {
			diffUrl: `${mergeRequestMatch[1]}.diff`,
			key: `${mergeRequestMatch[1]}${location.search}`,
			kind: "merge-request",
		};
	}

	const commitMatch = path.match(COMMIT_PATH_PATTERN);
	if (commitMatch?.[1] != null) {
		return {
			diffUrl: `${commitMatch[1]}.diff`,
			key: `${commitMatch[1]}${location.search}`,
			kind: "commit",
		};
	}

	const compareMatch = path.match(COMPARE_PATH_PATTERN);
	if (compareMatch?.[1] != null) {
		return {
			diffUrl: `${compareMatch[1]}.diff${location.search}`,
			key: `${compareMatch[1]}${location.search}`,
			kind: "compare",
		};
	}

	return null;
}
