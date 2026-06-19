// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

// https://astro.build/config
// Pages stay static (prerendered). Only routes marked `prerender = false`
// — i.e. the feedback API endpoint — run as Vercel serverless functions.
export default defineConfig({
  adapter: vercel(),
});
