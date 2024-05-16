import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import { vercelPreset } from "@vercel/remix/vite";
import mdx from "@mdx-js/rollup";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    mdx(),
    remix({
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
  ],
  assetsInclude: ["/app/**/*.md"],
});
