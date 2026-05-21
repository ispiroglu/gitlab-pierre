import { BUILTIN_GITLAB_INSTANCE_ORIGIN } from "../shared/gitlab-instance-constants";

export function normalizeInstanceOrigin(origin: string): string | null {
	try {
		const url = new URL(origin);
		if (url.pathname !== "/" || url.search !== "" || url.hash !== "") {
			return null;
		}
		return url.origin;
	} catch {
		return null;
	}
}

export function isBuiltInInstanceOrigin(origin: string): boolean {
	return origin === BUILTIN_GITLAB_INSTANCE_ORIGIN;
}

export function addOriginToPool(
	pooledOrigins: readonly string[],
	origin: string,
): string[] {
	const normalized = normalizeInstanceOrigin(origin);
	if (normalized == null || isBuiltInInstanceOrigin(normalized)) {
		return [...pooledOrigins];
	}
	if (pooledOrigins.includes(normalized)) {
		return [...pooledOrigins];
	}
	return [...pooledOrigins, normalized].sort();
}

export function removeOriginFromPool(
	pooledOrigins: readonly string[],
	origin: string,
): string[] {
	const normalized = normalizeInstanceOrigin(origin);
	if (normalized == null) {
		return [...pooledOrigins];
	}
	return pooledOrigins.filter((entry) => entry !== normalized);
}

export function isOriginInPool(
	pooledOrigins: readonly string[],
	origin: string,
): boolean {
	const normalized = normalizeInstanceOrigin(origin);
	if (normalized == null) {
		return false;
	}
	return pooledOrigins.includes(normalized);
}

export function listPooledOrigins(pooledOrigins: readonly string[]): string[] {
	return [...pooledOrigins].sort();
}
