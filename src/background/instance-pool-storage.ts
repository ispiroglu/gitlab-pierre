import {
	addOriginToPool,
	listPooledOrigins,
	removeOriginFromPool,
} from "../instance-pool/instance-pool";
import { INSTANCE_POOL_STORAGE_KEY } from "../shared/gitlab-instance-constants";

export async function readPooledOrigins(): Promise<string[]> {
	const stored = await chrome.storage.local.get(INSTANCE_POOL_STORAGE_KEY);
	const value = stored[INSTANCE_POOL_STORAGE_KEY];
	if (!Array.isArray(value)) {
		return [];
	}
	return listPooledOrigins(
		value.filter((entry): entry is string => typeof entry === "string"),
	);
}

export async function writePooledOrigins(
	origins: readonly string[],
): Promise<void> {
	await chrome.storage.local.set({
		[INSTANCE_POOL_STORAGE_KEY]: listPooledOrigins(origins),
	});
}

export async function addOriginToStoredPool(origin: string): Promise<string[]> {
	const pooledOrigins = await readPooledOrigins();
	const next = addOriginToPool(pooledOrigins, origin);
	await writePooledOrigins(next);
	return next;
}

export async function removeOriginFromStoredPool(
	origin: string,
): Promise<string[]> {
	const pooledOrigins = await readPooledOrigins();
	const next = removeOriginFromPool(pooledOrigins, origin);
	await writePooledOrigins(next);
	return next;
}
