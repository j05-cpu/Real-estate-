import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const isReplit    = process.env.REPL_ID !== undefined;

// PORT and BASE_PATH are Replit-injected at runtime.
// For Vercel / CI builds they are not set — use safe defaults.
const rawPort  = process.env.PORT;
const port     = rawPort && !Number.isNaN(Number(rawPort)) ? Number(rawPort) : 3000;
const basePath = process.env.BASE_PATH ?? "/";

// Replit-only dev plugins — loaded lazily so they don't break Vercel
async function replitPlugins() {
  if (isProduction || !isReplit) return [];
  try {
    const [{ cartographer }, { devBanner }, { default: runtimeErrorOverlay }] = await Promise.all([
      import("@replit/vite-plugin-cartographer"),
      import("@replit/vite-plugin-dev-banner"),
      import("@replit/vite-plugin-runtime-error-modal"),
    ]);
    return [
      cartographer({ root: path.resolve(import.meta.dirname, "..") }),
      devBanner(),
      runtimeErrorOverlay(),
    ];
  } catch {
    return [];
  }
}

export default defineConfig(async () => ({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    ...(await replitPlugins()),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
}));
