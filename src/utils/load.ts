import packageJSON from "../../package.json" with { type: "json" };
import type { List, PackageJSON } from "../../types/load.type.ts";
import { log } from "./log.ts";
import { process } from "./process.ts";

export const load = async (list: List): Promise<void> => {
	const { version } = packageJSON as PackageJSON;

	log("group", `%cgh-loader ${version}`, "color: inherit; font-weight: bold;");

	if (!list || (Array.isArray(list) && list.length === 0)) {
		log("warn", "No Gist ID or repository file path provided.");
		return;
	}

	const items = Array.isArray(list) ? list : [list];

	for (const item of items) {
		await process({ source: item, isRepo: item.includes("/") });
	}

	log("groupEnd");
};
