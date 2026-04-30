import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  base: "/archivo-vivo/",

  server: {
    proxy: {
      "/kobo": {
        target: "https://eu.kobotoolbox.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kobo/, "")
      },

      "/kobo-media": {
        target: "https://eu.kobotoolbox.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kobo-media/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "Authorization",
              `Token ${process.env.VITE_KOBO_TOKEN}`
            );
          });
        }
      }
    }
  }
});