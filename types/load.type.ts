export type List = string | string[];

export interface PackageJSON {
	version: string;
	[key: string]: unknown;
}
