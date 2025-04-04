import { expect, test } from "vitest";
import { MockGh } from "../src/utils/namespace.ts";

test("debug is true", () => {
	MockGh.debug = true;
	expect(MockGh.debug).toBe(true);
});
test("debug is false", () => {
	MockGh.debug = false;
	expect(MockGh.debug).toBe(false);
});
test("debug is a boolean", () => {
	expect(typeof MockGh.debug).toBe("boolean");
});
test("debug is not undefined", () => {
	expect(MockGh.debug).not.toBe(undefined);
});
test("debug is not null", () => {
	expect(MockGh.debug).not.toBe(null);
});
test("debug is not a string", () => {
	expect(typeof MockGh.debug).not.toBe("string");
});
test("debug is not a number", () => {
	expect(typeof MockGh.debug).not.toBe("number");
});
