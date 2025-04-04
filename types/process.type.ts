export interface ProcessArgs {
	source: string;
	isRepo?: boolean;
}

export interface FileInfo {
	status: "Loading" | "Skipping";
	color: "green" | "gray";
	ext: "js" | "css" | string;
}

export interface ProcessFileArgs {
	data: string;
	name: string;
	id: string;
	type: string;
	isTruncated?: boolean;
}

export interface GistFile {
	content: string;
	truncated: boolean;
}
