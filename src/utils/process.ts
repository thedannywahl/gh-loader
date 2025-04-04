import "./debug.ts";
import type { InsertArgs } from "../../types/insert.type.ts";
import type {
	FileInfo,
	GistFile,
	ProcessArgs,
	ProcessFileArgs,
} from "../../types/process.type.ts";
import { insert } from "./insert.ts";
import { log } from "./log.ts";

const getFileInfo = (fileName: string): FileInfo => {
	const ext =
		typeof fileName === "string" && fileName.includes(".")
			? fileName.split(".").pop()?.toLowerCase() || ""
			: "";
	const status = ext === "js" || ext === "css" ? "Loading" : "Skipping";
	const color = ext === "js" || ext === "css" ? "green" : "gray";

	return { status, color, ext };
};

const processFile = async ({
	data: fileData,
	name: fileName,
	id: sourceId,
	type: sourceType,
	isTruncated = false,
}: ProcessFileArgs): Promise<void> => {
	const { status, color, ext } = getFileInfo(fileName);
	const logMessage = [
		`%c${status} %cfile '${fileName}' from ${sourceType} '${sourceId}'`,
		`color: ${color}; font-weight: normal`,
		"font-weight: normal",
	];

	log("groupCollapsed", ...logMessage);

	if (ext !== "js" && ext !== "css") {
		log("Source:", fileData);
	} else {
		insert({
			content: fileData,
			raw_url: fileData,
			type: isTruncated ? "remote" : "inline",
			source: sourceType as InsertArgs["source"],
			tag: ext === "js" ? "script" : "style",
			attributes: {
				"data-gh-id": sourceId,
				"data-gh-file": fileName,
				"data-gh-type": isTruncated ? "remote" : "inline",
				"data-gh-source": sourceType,
			},
		});
	}

	log("groupEnd");
};

export const process = async ({
	source,
	isRepo = false,
}: ProcessArgs): Promise<void> => {
	if (isRepo) {
		const cleanedPath = source.replace(/^\//, "").replace("blob/", "");
		const [user, repo, ...rest] = cleanedPath.split("/");
		const fileName = rest.pop() || "";
		const filePath = rest.join("/");
		const fileData = { content: filePath };
		await processFile({
			data: fileData.content,
			name: fileName,
			id: `${user}/${repo}`,
			type: "repo",
			isTruncated: true,
		});
	} else {
		try {
			const response = await fetch(`https://api.github.com/gists/${source}`);
			const data = await response.json();

			const files = data.files as Record<string, GistFile>;

			for (const [fileName, fileData] of Object.entries(files)) {
				await processFile({
					data: fileData.content,
					name: fileName,
					id: source,
					type: "gist",
					isTruncated: fileData.truncated,
				});
			}
		} catch (error) {
			log("error", `Failed to fetch gist ${source}:`, error as Error);
		}
	}
};
