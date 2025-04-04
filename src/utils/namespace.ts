import type { Message, MethodOrMessage } from "../../types/log.type.ts";

/* export a mock of the globa gh namespace for testing */
export const MockGh = globalThis.MockGh || {
	debug: false,
	log: (methodOrMessage: MethodOrMessage, ...args: Message[]) =>
		console.log("Mocking log():", methodOrMessage, ...args),
	insert: (args: string[]) => console.log("Mocking insert():", args),
};

globalThis.MockGh = MockGh;
