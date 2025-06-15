import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());

  // 2. Option A: Merge into process.env for NodeJS access
  process.env = { ...process.env, ...env };

  return defineConfig({
    plugins: [react(), tailwindcss(), nodePolyfills()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      global: {}, // if you see 'global is not defined'
      "process.env": env,
    },
  });
};
