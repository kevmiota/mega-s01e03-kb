#!/bin/bash
# Copies the repo's src into this build, adds the shell files the export lacks, builds.
set -e
cd "$(dirname "$0")"
rm -rf src && cp -r ../repo/src src
cp tmpl/app.html src/app.html
cp tmpl/+layout.js src/routes/+layout.js
npx vite build 2>&1 | tail -25
