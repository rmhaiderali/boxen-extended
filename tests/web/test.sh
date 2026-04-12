#!/usr/bin/env sh

node tests/exit-if-no-build.js

if [ $? -eq 1 ]; then
    exit 1
fi

node tests/web/utils/transform-to-web-module.js

cp tests/web/index.html dist-web

RUNNER="npx"

if [ -x "$(command -v bun)" ]; then
    RUNNER="bunx --bun"
fi

PORT=3000 $RUNNER serve-static-cli dist-web
