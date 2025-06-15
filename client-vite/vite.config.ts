import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import inject from "@rollup/plugin-inject";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  process.env = { ...process.env, ...env };

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),

      // inject Buffer and process for runtime
      {
        ...inject({
          Buffer: ["buffer", "Buffer"],
          process: "process",
        }),
        enforce: "post",
      },
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),

        // Required polyfills
        stream: "stream-browserify",
        buffer: "buffer",
        process: "process/browser",
        crypto: "crypto-browserify",
        util: "util",
        assert: "assert",
      },
    },

    define: {
      global: "globalThis", // Critical fix for browser polyfill
      "process.env": env,
    },

    optimizeDeps: {
      include: [
        "buffer",
        "process",
        "stream-browserify",
        "crypto-browserify",
        "util",
        "assert",
      ],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
  });
};
