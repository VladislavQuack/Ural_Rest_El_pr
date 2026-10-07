import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOS_PREFIX = "/photos/";
const PHOTOS_DIR = path.resolve(__dirname, "public", "photos");

/**
 * Both the dev and the preview server have an SPA fallback that answers a
 * missing file with `200 index.html`. For photos that is wrong: a photo nobody
 * uploaded yet must come back as a real 404, otherwise the `onError` placeholder
 * in `src/photo.ts` never fires and the browser tries to decode HTML as an image.
 * This keeps the servers behaving like a plain static host for /photos/*.
 */
function photosNotFound(): Plugin {
  const missing = (url: string | undefined): boolean => {
    if (!url?.startsWith(PHOTOS_PREFIX)) return false;
    const rel = decodeURIComponent(url.slice(PHOTOS_PREFIX.length).split("?")[0]);
    const file = path.resolve(PHOTOS_DIR, rel);
    if (!file.startsWith(PHOTOS_DIR + path.sep)) return true; // no escaping the folder
    return !fs.existsSync(file);
  };

  const guard = (req: { url?: string }, res: { statusCode: number; end: (b: string) => void }, next: () => void) => {
    if (missing(req.url)) {
      res.statusCode = 404;
      res.end("photo not found");
      return;
    }
    next();
  };

  return {
    name: "photos-not-found",
    configureServer(server) {
      server.middlewares.use(guard);
    },
    configurePreviewServer(server) {
      server.middlewares.use(guard);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [photosNotFound(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    // Dev servers behind Arena's preview proxy need the tunnel host allowed;
    // extend via VITE_ALLOWED_HOSTS (comma-separated) when needed.
    allowedHosts: [".e2b.app", ...(process.env.VITE_ALLOWED_HOSTS?.split(",") ?? [])],
  },
});
