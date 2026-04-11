# Create patch file
# cd boxen
# git diff -U0 > ../tests/upstream-tests.patch

node tests/exit-if-no-build.js

if [ $? -eq 1 ]; then
    exit 1
fi

git submodule update --init boxen

sed -i '1s|.*|import boxen from "../boxen/index.js"|' dist/index.mjs

cd boxen

git restore .

if [ ! -d "node_modules" ]; then
    npm install
fi

git apply --unidiff-zero ../tests/upstream-tests.patch

npm run test

git restore .

cd ..

sed -i '1s|.*|import boxen from "boxen"|' dist/index.mjs
