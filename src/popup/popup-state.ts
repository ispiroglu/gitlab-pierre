import type { RegistrabilityResult } from "../registrability/registrability";

export const POPUP_TOP_STATE = {
	NON_GITLAB: "non-gitlab",
	UNREGISTERED_INSTANCE_PROMPT: "unregistered-instance-prompt",
	ALREADY_REGISTERED_STATUS: "already-registered-status",
} as const;

export type PopupTopState =
	(typeof POPUP_TOP_STATE)[keyof typeof POPUP_TOP_STATE];

export type PopupTopStateContext = {
	activeTabRegistrability: RegistrabilityResult | null;
	activeTabInPool: boolean;
};

export function resolvePopupTopState(
	context: PopupTopStateContext,
): PopupTopState {
	const { activeTabRegistrability, activeTabInPool } = context;

	if (activeTabRegistrability == null || !activeTabRegistrability.registrable) {
		return POPUP_TOP_STATE.NON_GITLAB;
	}

	if (activeTabInPool) {
		return POPUP_TOP_STATE.ALREADY_REGISTERED_STATUS;
	}

	return POPUP_TOP_STATE.UNREGISTERED_INSTANCE_PROMPT;
}
