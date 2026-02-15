// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://johnlitzsinger.com',
  output: 'static',
  integrations: [
    mdx(),
    react(),
    sitemap({ filter: (page) => !page.includes('/draft/') }),
  ],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
