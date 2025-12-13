import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// --- FIX 1: DEFINE __dirname MANUALLY (Required for Vite ESM) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- FIX 2: LOAD PLUGIN VIA REQUIRE (Bypasses the broken .mjs file) ---
const require = createRequire(import.meta.url);
// We load the CommonJS version which works correctly
const vitePrerenderPkg = require('vite-plugin-prerender');
const vitePrerender = vitePrerenderPkg.default || vitePrerenderPkg;

// Import the renderer standardly (this one is usually fine)
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';

export default defineConfig(async ({ mode }) => {
  const plugins = [
    react(),
    vitePrerender({
      // Explicitly point to the output folder
      staticDir: path.join(__dirname, 'dist'),
      
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
      
      renderer: new PuppeteerRenderer({
        // Prevent memory overload on Netlify
        maxConcurrentRoutes: 1,
        // Wait 2s for React to render the blog content
        renderAfterTime: 2000,
        // Optional: Run in headless mode (default, but good to be explicit)
        headless: true
      }),

      postProcess(context) {
        // Fix: Replace localhost URLs with your real domain for SEO
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
