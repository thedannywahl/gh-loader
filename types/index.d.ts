import type { InsertArgs } from "./insert.type.ts";
import type { Message, MethodOrMessage } from "./log.type.ts";

declare global {
	namespace gh {
		var debug: boolean;
		var log: (methodOrMessage: MethodOrMessage, ...args: Message[]) => void;
		var insert: (args: InsertArgs) => void;
	}
	namespace MockGh {
		var debug: boolean;
		var log: (methodOrMessage: MethodOrMessage, ...args: Message[]) => void;
		var insert: (args: InsertArgs) => void;
	}
}
