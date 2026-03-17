// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://johnlitzsinger.com',
  trailingSlash: 'never',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
