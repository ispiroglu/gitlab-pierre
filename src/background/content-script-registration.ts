import {
	CONTENT_SCRIPT_FILE,
	CONTENT_STYLE_FILE,
} from "../shared/gitlab-instance-constants";

export function hostPermissionPatternForOrigin(origin: string): string {
	return `${origin}/*`;
}

export function contentScriptIdForOrigin(origin: string): string {
	const safeId = origin.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	return `gitlab-pierre-instance-${safeId}`;
}

export function contentScriptMatchesForOrigin(origin: string): string[] {
	return [hostPermissionPatternForOrigin(origin)];
}

export async function registerContentScriptsForOrigin(
	origin: string,
): Promise<void> {
	const id = contentScriptIdForOrigin(origin);
	const existing = await chrome.scripting.getRegisteredContentScripts({
		ids: [id],
	});
	if (existing.length > 0) {
		await chrome.scripting.unregisterContentScripts({ ids: [id] });
	}

	await chrome.scripting.registerContentScripts([
		{
			id,
			matches: contentScriptMatchesForOrigin(origin),
			js: [CONTENT_SCRIPT_FILE],
			css: [CONTENT_STYLE_FILE],
			runAt: "document_idle",
			persistAcrossSessions: true,
		},
	]);
}

export async function unregisterContentScriptsForOrigin(
	origin: string,
): Promise<void> {
	const id = contentScriptIdForOrigin(origin);
	const existing = await chrome.scripting.getRegisteredContentScripts({
		ids: [id],
	});
	if (existing.length === 0) {
		return;
	}
	await chrome.scripting.unregisterContentScripts({ ids: [id] });
}

export async function restoreContentScriptsForOrigins(
	origins: readonly string[],
): Promise<void> {
	for (const origin of origins) {
		await registerContentScriptsForOrigin(origin);
	}
}
