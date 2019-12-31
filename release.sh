#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

BASE_BRANCH="$(git branch --show-current)"

echo "Base branch is ${BASE_BRANCH}, continue? (y/n)"
read -r res
if [ "${res}" = "n" ]; then
  echo "Stop script"
  exit 0
fi

RELEASE_TYPE_LIST="major minor patch premajor preminor prepatch prerelease"

if command -v fzf; then
  RELEASE_TYPE=$(echo "${RELEASE_TYPE_LIST}" | tr ' ' '\n' | fzf --layout=reverse)
else
  select sel in ${RELEASE_TYPE_LIST}; do
    RELEASE_TYPE="${sel}"
    break
  done
fi

echo "Create ${RELEASE_TYPE} release"
RELEASE_BRANCH="release-${RELEASE_TYPE}"
echo "Release branch is ${RELEASE_BRANCH}"

git fetch origin
git push origin "${BASE_BRANCH}"
git pull origin "${BASE_BRANCH}"

if ! git branch "${RELEASE_BRANCH}"; then
  exit 1
fi

git checkout "${RELEASE_BRANCH}"
git push origin "${RELEASE_BRANCH}"
