import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	build: {
		copyPublicDir: false,
		emptyOutDir: false,
		outDir: "dist",
		rollupOptions: {
			input: {
				background: path.join(rootDir, "src/background/background.ts"),
				popup: path.join(rootDir, "src/popup/popup.ts"),
			},
			output: {
				entryFileNames: "[name].js",
				format: "es",
			},
		},
		sourcemap: false,
	},
});
