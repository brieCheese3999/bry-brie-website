import { fileURLToPath } from 'node:url';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    react(),
    // TaskBar has no clock override prop. Replace only its internal clock,
    // preserving the library's Start/menu/window behavior without a global timer patch.
    {
      name: 'portfolio-taskbar-clock',
      enforce: 'pre',
      transform(code, id) {
        const modulePath = id.split('?')[0].replaceAll('\\', '/');
        if (modulePath.endsWith('/@react95/core/esm/TaskBar/Clock.mjs')) {
          const clock = fileURLToPath(new URL('./src/components/Home/PortfolioClock.tsx', import.meta.url));
          return `export { Clock } from ${JSON.stringify(clock)};`;
        }
        if (!modulePath.includes('/@react95/core/esm/')) return;
        // Core's icon barrel retains hundreds of memoized SVG components.
        // Import only the icons each core module actually uses.
        return code.replace(/import\s*\{([^}]+)\}\s*from\s*["']@react95\/icons["'];?/g,
          (_, names: string) => names.split(',').map(name => {
            const iconName = name.trim();
            return `import { ${iconName} } from "@react95/icons/${iconName}";`;
          }).join('\n'));
      },

    },
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
  optimizeDeps: {
    exclude: ['@react95/core'],
    include: ['classnames', '@neodrag/react', 'rainbow-sprinkles', '@vanilla-extract/dynamic', '@vanilla-extract/recipes', 'nanoid', 'usehooks-ts'],
  },
  css: {
    transformer: "postcss",
  },
  build: {
    cssMinify: false,
  },
});
