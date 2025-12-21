import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import prerender from "vite-plugin-prerender"; // ❌ Commented out to fix crash

export default defineConfig(async ({ mode }) => {
  const plugins = [
    react(),
    // ❌ Disabled Prerender temporarily because it causes "require is not defined" error
    // We can enable a modern alternative later for SEO.
    /*
    prerender({
      routes: [
        '/',
        '/about',
        '/contact',
        '/features',
        '/blog',
        '/blog/scientific-study-techniques-2025',
        '/blog/manage-exam-stress-guide',
        '/blog/digital-vs-paper-notes',
      ],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterTime: 500,
      },
      postProcess(renderedRoute) {
        renderedRoute.html = renderedRoute.html.replace(
          /http:\/\/localhost:\d+/g,
          'https://margdarshan.tech'
        );
        return renderedRoute;
      },
    }),
    */
  ];

  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch (e) {
      // Ignore if tagger fails, it's optional
    }
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
