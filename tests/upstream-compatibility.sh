# Create patch file
# cd boxen
# git diff -U0 > ../tests/upstream-tests.patch

if [ ! -d "dist-boxen-from-git" ]; then
    mkdir dist-boxen-from-git
fi

cp dist/index.mjs dist-boxen-from-git/index.mjs

sed -i '1s|.*|import boxen from "../boxen/index.js"|' dist-boxen-from-git/index.mjs

cd boxen

git restore .

if [ ! -d "node_modules" ]; then
    npm install
fi

git apply --unidiff-zero ../tests/upstream-tests.patch

npm run test

git restore .
