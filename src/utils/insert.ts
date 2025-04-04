import type { InsertArgs } from "../../types/insert.type.ts";
import { log } from "./log.ts";

export const insert = ({
	content,
	raw_url,
	type = "inline",
	source = "gist",
	tag = "script",
	attributes = {},
	async = false,
	defer = false,
}: InsertArgs): void => {
	log(`Type: ${type} ${tag}`, "Source:", { content, raw_url });

	const elementType =
		type === "inline" ? tag : tag === "script" ? "script" : "link";
	const element = document.createElement(elementType);

	if (type === "inline") {
		element.textContent = content;
		if (tag === "style") {
			element.setAttribute("type", "text/css");
		}
	} else {
		const src =
			source === "gist"
				? raw_url.replace("gist.githubusercontent", "gistcdn.githack")
				: `https://rawcdn.githack.com/${content}`;
		const attr = tag === "script" ? "src" : "href";
		element.setAttribute(attr, src);
		if (tag === "style") {
			element.setAttribute("rel", "stylesheet");
		}
	}

	for (const [key, value] of Object.entries(attributes)) {
		element.setAttribute(key, value);
	}

	if (tag === "script") {
		if (async) element.setAttribute("async", "true");
		if (defer) element.setAttribute("defer", "true");
	}

	log(`${tag.charAt(0).toUpperCase() + tag.slice(1)} Element:`, element);

	const target = tag === "script" ? document.body : document.head;
	target.appendChild(element);
};
