import {
	BUILTIN_GITLAB_INSTANCE_ORIGIN,
	GITLAB_ROUTE_SEGMENT,
} from "../shared/gitlab-instance-constants";
import { normalizeInstanceOrigin } from "../instance-pool/instance-pool";

export const REGISTRABILITY_REASON = {
	NOT_HTTPS: "not-https",
	MISSING_GITLAB_ROUTE: "missing-gitlab-route",
	BUILT_IN_INSTANCE: "built-in-instance",
	INVALID_URL: "invalid-url",
} as const;

export type RegistrabilityReason =
	(typeof REGISTRABILITY_REASON)[keyof typeof REGISTRABILITY_REASON];

export type RegistrableTab = {
	registrable: true;
	origin: string;
};

export type NonRegistrableTab = {
	registrable: false;
	reason: RegistrabilityReason;
};

export type RegistrabilityResult = RegistrableTab | NonRegistrableTab;

export function getRegistrabilityForUrl(
	url: string,
	builtInOrigin: string = BUILTIN_GITLAB_INSTANCE_ORIGIN,
): RegistrabilityResult {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return { registrable: false, reason: REGISTRABILITY_REASON.INVALID_URL };
	}

	if (parsed.protocol !== "https:") {
		return { registrable: false, reason: REGISTRABILITY_REASON.NOT_HTTPS };
	}

	if (!parsed.pathname.includes(GITLAB_ROUTE_SEGMENT)) {
		return {
			registrable: false,
			reason: REGISTRABILITY_REASON.MISSING_GITLAB_ROUTE,
		};
	}

	const origin = normalizeInstanceOrigin(parsed.origin);
	if (origin == null) {
		return { registrable: false, reason: REGISTRABILITY_REASON.INVALID_URL };
	}

	if (origin === builtInOrigin) {
		return {
			registrable: false,
			reason: REGISTRABILITY_REASON.BUILT_IN_INSTANCE,
		};
	}

	return { registrable: true, origin };
}

export function originToHostname(origin: string): string {
	return new URL(origin).hostname;
}
