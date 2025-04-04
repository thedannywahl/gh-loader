import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			name: "gh",
			fileName: (format) => {
				if (format === "umd") {
						return `ghl.umd.min.js`;
				}
				return `ghl.${format}.js`;
		},		},
		outDir: "dist",
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: false,
			},
			mangle: {
				reserved: ["gh"],
			},
		},
		rollupOptions: {
			input: {
				main: resolve(__dirname, "src/main.ts"),
			},
			output: {
				manualChunks: undefined,
			},
		},
	},
});
