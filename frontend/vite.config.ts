// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@supabase")) {
                return "vendor-supabase";
              }
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("framer-motion") || id.includes("motion")) {
                return "vendor-motion";
              }
              if (id.includes("@radix-ui")) {
                return "vendor-radix";
              }
            }
            return undefined;
          },
        },
      },
    },
  },
});
