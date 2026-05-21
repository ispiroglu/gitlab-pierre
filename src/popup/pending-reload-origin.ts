export const PENDING_RELOAD_ORIGIN_SESSION_KEY =
	"gitlabPierrePendingReloadOrigin";

export async function setPendingReloadOrigin(origin: string): Promise<void> {
	await chrome.storage.session.set({
		[PENDING_RELOAD_ORIGIN_SESSION_KEY]: origin,
	});
}

export async function getPendingReloadOrigin(): Promise<string | null> {
	const stored = await chrome.storage.session.get(
		PENDING_RELOAD_ORIGIN_SESSION_KEY,
	);
	const value = stored[PENDING_RELOAD_ORIGIN_SESSION_KEY];
	return typeof value === "string" ? value : null;
}

export async function clearPendingReloadOrigin(): Promise<void> {
	await chrome.storage.session.remove(PENDING_RELOAD_ORIGIN_SESSION_KEY);
}

export function matchesPendingReloadPrompt(
	pendingOrigin: string | null,
	instanceOrigin: string,
	isChangesPage: boolean,
): boolean {
	if (!isChangesPage) {
		return false;
	}
	return pendingOrigin === instanceOrigin;
}

export function shouldOfferReloadPrompt(
	instanceOrigin: string,
	isChangesPage: boolean,
	pendingOrigin: string | null,
): boolean {
	return matchesPendingReloadPrompt(
		pendingOrigin,
		instanceOrigin,
		isChangesPage,
	);
}
