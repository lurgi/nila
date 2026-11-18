import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const site = 'https://nila.im';
const excludedPaths = new Set(['/beta', '/404', '/500']);
const xmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    react(),
    {
      name: 'nila-sitemap',
      hooks: {
        'astro:build:done': async ({ pages, dir }) => {
          const urls = new Set();

          for (const { pathname } of pages) {
            const url = new URL(site);
            url.pathname = pathname;
            if (!excludedPaths.has(url.pathname.replace(/\/$/, ''))) {
              urls.add(url.href);
            }
          }

          const entries = [...urls].sort().map((url) => {
            const loc = url.replace(/[&<>"']/g, (character) => xmlEntities[character]);
            return `  <url><loc>${loc}</loc></url>`;
          });
          const xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...entries,
            '</urlset>',
            '',
          ].join('\n');

          await writeFile(new URL('sitemap.xml', dir), xml, 'utf8');
        },
      },
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
