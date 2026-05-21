import type { PopupState } from "../background/background";
import { getChangesPage } from "../changes-page/changes-page";
import { BACKGROUND_MESSAGE_TYPE } from "../shared/extension-messages";
import { originToHostname } from "../registrability/registrability";
import { POPUP_TOP_STATE, resolvePopupTopState } from "./popup-state";

const POPUP_ROOT_ID = "popup-root";

const REGISTER_BUTTON_LABEL = "Register this GitLab";

const BUILT_IN_BADGE_LABEL = "Always on";

const REGISTERED_STATUS_PREFIX = "Registered:";

const RELOAD_GUIDANCE_TEXT =
	"Reload this tab to activate Pierre on the current changes page.";

const RELOAD_TAB_BUTTON_LABEL = "Reload tab";

async function getActiveTabUrl(): Promise<string | null> {
	const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
	const activeTab = tabs[0];
	return activeTab?.url ?? null;
}

async function reloadActiveTab(): Promise<void> {
	const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
	const activeTab = tabs[0];
	if (activeTab?.id == null) {
		return;
	}
	await chrome.tabs.reload(activeTab.id);
}

async function loadPopupState(): Promise<PopupState> {
	const activeTabUrl = await getActiveTabUrl();
	return chrome.runtime.sendMessage({
		type: BACKGROUND_MESSAGE_TYPE.GET_POPUP_STATE,
		activeTabUrl,
	}) as Promise<PopupState>;
}

async function registerActiveTab(activeTabUrl: string): Promise<boolean> {
	const response = (await chrome.runtime.sendMessage({
		type: BACKGROUND_MESSAGE_TYPE.REGISTER_INSTANCE,
		activeTabUrl,
	})) as { ok?: boolean };
	return response?.ok === true;
}

async function deregisterOrigin(origin: string): Promise<void> {
	await chrome.runtime.sendMessage({
		type: BACKGROUND_MESSAGE_TYPE.DEREGISTER_INSTANCE,
		origin,
	});
}

function createElement<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className?: string,
): HTMLElementTagNameMap[K] {
	const element = document.createElement(tag);
	if (className != null) {
		element.className = className;
	}
	return element;
}

function isActiveTabChangesPage(activeTabUrl: string | null): boolean {
	if (activeTabUrl == null) {
		return false;
	}
	try {
		const parsed = new URL(activeTabUrl);
		return getChangesPage(parsed) != null;
	} catch {
		return false;
	}
}

function renderInstanceHeader(section: HTMLElement, origin: string): void {
	const header = createElement("p", "popup-instance-header");
	header.textContent = origin;
	section.append(header);
}

function renderRegisterSection(
	container: HTMLElement,
	state: PopupState,
	activeTabUrl: string | null,
): void {
	const topState = resolvePopupTopState({
		activeTabRegistrability: state.activeTabRegistrability,
		activeTabInPool: state.activeTabInPool,
	});

	if (topState === POPUP_TOP_STATE.NON_GITLAB) {
		return;
	}

	const registrability = state.activeTabRegistrability;
	if (registrability?.registrable !== true) {
		return;
	}

	const section = createElement("section", "popup-section");
	renderInstanceHeader(section, registrability.origin);

	if (topState === POPUP_TOP_STATE.UNREGISTERED_INSTANCE_PROMPT) {
		const actionRow = createElement("div", "popup-action-row");
		const registerButton = createElement(
			"button",
			"popup-button popup-button-primary",
		);
		registerButton.textContent = REGISTER_BUTTON_LABEL;
		registerButton.addEventListener("click", () => {
			if (activeTabUrl == null) {
				return;
			}
			registerButton.disabled = true;
			void registerActiveTab(activeTabUrl)
				.then(() => renderPopup())
				.catch(() => {
					registerButton.disabled = false;
				});
		});
		actionRow.append(registerButton);
		section.append(actionRow);
		container.append(section);
		return;
	}

	const status = createElement("p", "popup-status");
	status.textContent = `${REGISTERED_STATUS_PREFIX} ${registrability.origin}`;
	section.append(status);
	container.append(section);

	if (isActiveTabChangesPage(activeTabUrl)) {
		renderReloadGuidance(container);
	}
}

function renderReloadGuidance(container: HTMLElement): void {
	const section = createElement(
		"section",
		"popup-section popup-reload-section",
	);
	const guidance = createElement("p", "popup-note");
	guidance.textContent = RELOAD_GUIDANCE_TEXT;
	const actionRow = createElement("div", "popup-action-row");
	const reloadButton = createElement(
		"button",
		"popup-button popup-button-secondary",
	);
	reloadButton.textContent = RELOAD_TAB_BUTTON_LABEL;
	reloadButton.addEventListener("click", () => {
		void reloadActiveTab();
	});
	actionRow.append(reloadButton);
	section.append(guidance, actionRow);
	container.append(section);
}

function renderInstanceList(container: HTMLElement, state: PopupState): void {
	const section = createElement("section", "popup-section");
	const heading = createElement("h2", "popup-heading");
	heading.textContent = "GitLab instances";
	section.append(heading);

	const list = createElement("ul", "popup-instance-list");

	const builtInItem = createElement("li", "popup-instance-item");
	const builtInLabel = createElement("span", "popup-instance-label");
	builtInLabel.textContent = originToHostname(state.builtInOrigin);
	const builtInBadge = createElement("span", "popup-instance-badge");
	builtInBadge.textContent = BUILT_IN_BADGE_LABEL;
	builtInItem.append(builtInLabel, builtInBadge);
	list.append(builtInItem);

	for (const origin of state.pooledOrigins) {
		const item = createElement("li", "popup-instance-item");
		const label = createElement("span", "popup-instance-label");
		label.textContent = originToHostname(origin);
		const removeButton = createElement("button", "popup-icon-button");
		removeButton.type = "button";
		removeButton.title = `Deregister ${origin}`;
		removeButton.textContent = "−";
		removeButton.addEventListener("click", () => {
			void deregisterOrigin(origin).then(() => {
				void renderPopup();
			});
		});
		item.append(label, removeButton);
		list.append(item);
	}

	section.append(list);
	container.append(section);
}

async function renderPopup(): Promise<void> {
	const root = document.getElementById(POPUP_ROOT_ID);
	if (root == null) {
		return;
	}

	root.replaceChildren();
	const [state, activeTabUrl] = await Promise.all([
		loadPopupState(),
		getActiveTabUrl(),
	]);
	renderRegisterSection(root, state, activeTabUrl);
	renderInstanceList(root, state);
}

void renderPopup();
