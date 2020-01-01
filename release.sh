#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

if [ "$(git branch --show-current)" != "master" ]; then
  echo "Current branch is not master" 1>&2
  exit 1
fi

git fetch origin
git pull origin master
git pull origin --tags

mkdir ./lib
npm run build
git add ./lib/index.js
git commit -m "chore(release): Add build assets"

npm run release --preset eslint

git rm ./lib/index.js
rm -rf ./lib
git commit -m "chore(release): Remove build assets"

TAG_NAME="v$(jq -r '.version' ./package.json)"
git push origin master
git push origin "${TAG_NAME}"
