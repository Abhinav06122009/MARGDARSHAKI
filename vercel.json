import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { prerender } from 'vite-plugin-prerender';

export default defineConfig(async ({ mode }) => {
  const plugins = [
    react(),
    // ADD THIS BLOCK
    prerender({
      routes: [
        '/',
        '/about',
        '/contact',
        '/features',
        '/blog',
        // You MUST list your blog post URLs here for them to be indexed properly
        '/blog/scientific-study-techniques-2025',
        '/blog/manage-exam-stress-guide',
        '/blog/digital-vs-paper-notes',
        // ... add all other blog IDs here
      ],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterTime: 500, // Wait for content to load
      },
      postProcess(renderedRoute) {
        // Fix local paths to production URL
        renderedRoute.html = renderedRoute.html.replace(
          /http:\/\/localhost:\d+/g,
          'https://margdarshan.tech'
        );
        return renderedRoute;
      },
    }),
  ];

  if (mode === "development") {
    const { componentTagger } = await import("lovable-tagger");
    plugins.push(componentTagger());
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
