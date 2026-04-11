#!/usr/bin/env sh

node tests/exit-if-no-build.js

if [ $? -eq 1 ]; then
    exit 1
fi

node tests/node/index.js
