// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // canonical URL — swap for the custom domain when there is one
  site: 'https://anessbouziani.vercel.app',
  integrations: [sitemap()],
});
