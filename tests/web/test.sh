#!/usr/bin/env sh

node tests/exit-if-no-build.js

if [ $? -eq 1 ]; then
    exit 1
fi

node tests/web/utils/transform-to-web-module.js

cp tests/web/index.html dist-web

PORT=3000 npx serve-static-cli dist-web
