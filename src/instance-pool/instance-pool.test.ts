import { describe, expect, it } from "vitest";
import {
	addOriginToPool,
	isBuiltInInstanceOrigin,
	isOriginInPool,
	listPooledOrigins,
	normalizeInstanceOrigin,
	removeOriginFromPool,
} from "./instance-pool";

describe("instance pool", () => {
	it("normalizes valid origins", () => {
		expect(normalizeInstanceOrigin("https://gitlab.trendyol.com")).toBe(
			"https://gitlab.trendyol.com",
		);
		expect(normalizeInstanceOrigin("https://gitlab.trendyol.com:8443")).toBe(
			"https://gitlab.trendyol.com:8443",
		);
	});

	it("rejects origins with path or query", () => {
		expect(
			normalizeInstanceOrigin("https://gitlab.trendyol.com/path"),
		).toBeNull();
		expect(
			normalizeInstanceOrigin("https://gitlab.trendyol.com?a=1"),
		).toBeNull();
	});

	it("adds and removes pooled origins without built-in", () => {
		const initial: string[] = [];
		const added = addOriginToPool(initial, "https://gitlab.trendyol.com");
		expect(added).toEqual(["https://gitlab.trendyol.com"]);
		expect(isOriginInPool(added, "https://gitlab.trendyol.com")).toBe(true);
		expect(isBuiltInInstanceOrigin("https://gitlab.com")).toBe(true);
		expect(addOriginToPool(added, "https://gitlab.com")).toEqual(added);
		const removed = removeOriginFromPool(added, "https://gitlab.trendyol.com");
		expect(removed).toEqual([]);
		expect(listPooledOrigins(removed)).toEqual([]);
	});

	it("deduplicates on add", () => {
		const pooled = addOriginToPool([], "https://gitlab.example.com");
		expect(addOriginToPool(pooled, "https://gitlab.example.com")).toEqual(
			pooled,
		);
	});
});
