import {
	isBuiltInInstanceOrigin,
	isOriginInPool,
	normalizeInstanceOrigin,
} from "../instance-pool/instance-pool";
import { getRegistrabilityForUrl } from "../registrability/registrability";
import { BACKGROUND_MESSAGE_TYPE } from "../shared/extension-messages";
import {
	BUILTIN_GITLAB_INSTANCE_ORIGIN,
	PAGE_BRIDGE_SCRIPT_FILE,
} from "../shared/gitlab-instance-constants";
import {
	hostPermissionPatternForOrigin,
	registerContentScriptsForOrigin,
	restoreContentScriptsForOrigins,
	unregisterContentScriptsForOrigin,
} from "./content-script-registration";
import {
	addOriginToStoredPool,
	readPooledOrigins,
	removeOriginFromStoredPool,
	writePooledOrigins,
} from "./instance-pool-storage";

type RegisterInstanceMessage = {
	type: typeof BACKGROUND_MESSAGE_TYPE.REGISTER_INSTANCE;
	activeTabUrl: string;
};

type DeregisterInstanceMessage = {
	type: typeof BACKGROUND_MESSAGE_TYPE.DEREGISTER_INSTANCE;
	origin: string;
};

type GetPopupStateMessage = {
	type: typeof BACKGROUND_MESSAGE_TYPE.GET_POPUP_STATE;
	activeTabUrl: string | null;
};

type InjectPageBridgeMessage = {
	type: typeof BACKGROUND_MESSAGE_TYPE.INJECT_PAGE_BRIDGE;
};

type BackgroundMessage =
	| RegisterInstanceMessage
	| DeregisterInstanceMessage
	| GetPopupStateMessage
	| InjectPageBridgeMessage;

export type PopupState = {
	builtInOrigin: string;
	pooledOrigins: string[];
	activeTabRegistrability: ReturnType<typeof getRegistrabilityForUrl> | null;
	activeTabInPool: boolean;
};

async function hasHostPermissionForOrigin(origin: string): Promise<boolean> {
	return chrome.permissions.contains({
		origins: [hostPermissionPatternForOrigin(origin)],
	});
}

async function requestHostPermissionForOrigin(
	origin: string,
): Promise<boolean> {
	return chrome.permissions.request({
		origins: [hostPermissionPatternForOrigin(origin)],
	});
}

async function revokeHostPermissionForOrigin(origin: string): Promise<void> {
	const pattern = hostPermissionPatternForOrigin(origin);
	const hasPermission = await chrome.permissions.contains({
		origins: [pattern],
	});
	if (!hasPermission) {
		return;
	}
	await chrome.permissions.remove({ origins: [pattern] });
}

export async function registerInstance(
	activeTabUrl: string,
): Promise<{ ok: boolean }> {
	const registrability = getRegistrabilityForUrl(activeTabUrl);
	if (!registrability.registrable) {
		return { ok: false };
	}

	const permissionGranted = await requestHostPermissionForOrigin(
		registrability.origin,
	);
	if (!permissionGranted) {
		return { ok: false };
	}

	await addOriginToStoredPool(registrability.origin);
	await registerContentScriptsForOrigin(registrability.origin);
	return { ok: true };
}

export async function deregisterInstance(
	origin: string,
): Promise<{ ok: boolean }> {
	const normalized = normalizeInstanceOrigin(origin);
	if (normalized == null || isBuiltInInstanceOrigin(normalized)) {
		return { ok: false };
	}

	await removeOriginFromStoredPool(normalized);
	await unregisterContentScriptsForOrigin(normalized);
	await revokeHostPermissionForOrigin(normalized);
	return { ok: true };
}

export async function restoreInstancePool(): Promise<void> {
	const pooledOrigins = await readPooledOrigins();
	const restorableOrigins: string[] = [];

	for (const origin of pooledOrigins) {
		const hasPermission = await hasHostPermissionForOrigin(origin);
		if (hasPermission) {
			restorableOrigins.push(origin);
		}
	}

	if (restorableOrigins.length !== pooledOrigins.length) {
		await writePooledOrigins(restorableOrigins);
	}

	await restoreContentScriptsForOrigins(restorableOrigins);
}

async function buildPopupState(
	activeTabUrl: string | null,
): Promise<PopupState> {
	const pooledOrigins = await readPooledOrigins();
	const activeTabRegistrability =
		activeTabUrl == null ? null : getRegistrabilityForUrl(activeTabUrl);
	const activeOrigin =
		activeTabRegistrability?.registrable === true
			? activeTabRegistrability.origin
			: null;

	return {
		builtInOrigin: BUILTIN_GITLAB_INSTANCE_ORIGIN,
		pooledOrigins,
		activeTabRegistrability,
		activeTabInPool:
			activeOrigin != null && isOriginInPool(pooledOrigins, activeOrigin),
	};
}

async function injectPageBridgeForTab(tabId: number): Promise<boolean> {
	try {
		await chrome.scripting.executeScript({
			target: { tabId },
			world: "MAIN",
			files: [PAGE_BRIDGE_SCRIPT_FILE],
		});
		return true;
	} catch {
		return false;
	}
}

chrome.runtime.onInstalled.addListener(() => {
	void restoreInstancePool();
});

chrome.runtime.onStartup.addListener(() => {
	void restoreInstancePool();
});

void restoreInstancePool();

chrome.runtime.onMessage.addListener(
	(
		message: BackgroundMessage,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response?: unknown) => void,
	): boolean => {
		if (message.type === BACKGROUND_MESSAGE_TYPE.REGISTER_INSTANCE) {
			void registerInstance(message.activeTabUrl).then(sendResponse);
			return true;
		}

		if (message.type === BACKGROUND_MESSAGE_TYPE.DEREGISTER_INSTANCE) {
			void deregisterInstance(message.origin).then(sendResponse);
			return true;
		}

		if (message.type === BACKGROUND_MESSAGE_TYPE.GET_POPUP_STATE) {
			void buildPopupState(message.activeTabUrl).then(sendResponse);
			return true;
		}

		if (message.type === BACKGROUND_MESSAGE_TYPE.INJECT_PAGE_BRIDGE) {
			const tabId = sender.tab?.id;
			if (tabId == null) {
				sendResponse({ ok: false });
				return false;
			}
			void injectPageBridgeForTab(tabId).then((ok) => sendResponse({ ok }));
			return true;
		}

		return false;
	},
);
