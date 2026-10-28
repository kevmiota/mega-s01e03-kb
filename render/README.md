# render

How `rendered/` was built: the kb export ships without a build setup, so these files add the
minimum SvelteKit 3 + mdsvex shell around `src/` (`app.html`, a prerendering root layout, the
`runbook` layout registered for mdsvex, `#lib/*` as a package.json subpath import).

`sync.sh` expects to sit in a build folder next to this repo (`../repo/src`); it copies `src/`,
adds `tmpl/`, and runs `vite build` into `out/`, which was copied here as `rendered/`.

The new page renders at `rendered/kb/incidents/4471/problems.html`.
