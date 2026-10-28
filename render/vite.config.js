import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const runbook = fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook } })],
      adapter: adapter({ pages: 'out', assets: 'out', strict: false }),
      prerender: {
        entries: ['/kb', '/kb/incidents/4471', '/kb/incidents/4471/problems', '/kb/triage/dedupe', '/kb/decisions/0001-dedupe-by-subject'],
        handleHttpError: 'warn',
      },
    }),
  ],
});
