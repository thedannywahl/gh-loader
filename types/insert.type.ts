type Embed = "inline" | "remote";
type Source = "gist" | "repo";
type Tag = "script" | "link" | "style";

export interface InsertArgs {
	content: string;
	raw_url: string;
	type?: Embed;
	source?: Source;
	tag?: Tag;
	attributes?: Record<string, string>;
	async?: boolean;
	defer?: boolean;
}
