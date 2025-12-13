import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// FIXED: Use default import for the plugin
import vitePrerender from 'vite-plugin-prerender';
// FIXED: Import the renderer class directly from the package you installed
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';

export default defineConfig(async ({ mode }) => {
  const plugins = [
    react(),
    vitePrerender({
      // FIXED: explicit staticDir is required by this plugin
      staticDir: path.resolve(__dirname, 'dist'),
      
      routes: [
        '/',
        '/about',
        '/contact',
        '/features',
        '/blog',
        // Blog Posts
        '/blog/scientific-study-techniques-2025',
        '/blog/manage-exam-stress-guide',
        '/blog/digital-vs-paper-notes',
        '/blog/how-to-create-study-schedule',
        '/blog/grade-tracking-benefits',
        '/blog/deep-work-for-students',
        '/blog/stop-procrastination-2-minute-rule',
        '/blog/sleep-hygiene-students',
      ],
      
      // FIXED: Instantiate the renderer with options
      renderer: new PuppeteerRenderer({
        // Limit concurrency to prevent crashing Netlify's build memory
        maxConcurrentRoutes: 1,
        // Wait for dynamic content (like your blog text) to load
        renderAfterTime: 2000, 
      }),

      postProcess(context) {
        // Fix: Replace local URLs with your real domain for SEO
        if (context.html) {
          context.html = context.html.replace(
            /http:\/\/localhost:\d+/g,
            'https://margdarshan.tech'
          );
        }
        return context;
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
