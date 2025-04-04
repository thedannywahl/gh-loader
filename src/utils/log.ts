import "./debug.ts";
import type {
	Console,
	LogArgs,
	Message,
	MethodOrMessage,
} from "../../types/log.type.ts";

const getLogMethod = (type: Console): ((...args: Message[]) => void) => {
	return (console as typeof console)[type] || console.log;
};

const isConsole = (value: MethodOrMessage): value is Console => {
	return (
		typeof value === "string" &&
		[
			"log",
			"warn",
			"error",
			"info",
			"group",
			"groupCollapsed",
			"groupEnd",
		].includes(value)
	);
};

export const log = (...args: LogArgs): void => {
	if (gh.debug) {
		const [methodOrMessage, ...rest] = args;
		const type: Console = isConsole(methodOrMessage) ? methodOrMessage : "log";

		const logArgs =
			typeof methodOrMessage === "object"
				? [JSON.stringify(methodOrMessage), ...rest]
				: [methodOrMessage, ...rest];

		const logMethod = getLogMethod(type);
		if (type === "group" || type === "groupCollapsed") {
			logMethod(...rest);
		} else if (type === "groupEnd") {
			console.groupEnd();
		} else {
			logMethod(...logArgs);
		}
	}
};
