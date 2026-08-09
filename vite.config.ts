import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    react(),
    imagetools({
      include: /[^?]+\.(jpe?g|png|tiff?|avif|gif|webp)(\?.*)?$/i,
      defaultDirectives: (url) => {
        // Escape hatch: import with `?original` to opt a specific asset out.
        if (url.searchParams.has("original")) return new URLSearchParams();
        return new URLSearchParams({
          format: "webp",
          quality: "78",
          w: "1600",
          h: "1600",
          fit: "inside",
          withoutEnlargement: "true",
        });
      },
    }),
  ],
  css: {
    transformer: "postcss",
  },
  build: {
    cssMinify: false,
  },
});
