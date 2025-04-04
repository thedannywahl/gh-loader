export type Console =
	| "log"
	| "warn"
	| "error"
	| "info"
	| "group"
	| "groupCollapsed"
	| "groupEnd";

export type MethodOrMessage = Console | string | object | HTMLElement | Error;

export type Message = Omit<MethodOrMessage, Console>;

export type LogArgs = [MethodOrMessage, ...Message[]];
