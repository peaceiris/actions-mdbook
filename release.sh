#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

RELEASE_BRANCH="release-${1}"

if [ "$(git branch --show-current)" != "master" ]; then
    echo "Current branch is not master" 1>&2
    exit 1
fi

if [ $# -ne 1 ]; then
    echo "Length of argument must be 1" 1>&2
    exit 1
fi

git fetch origin
git pull origin master

if ! git branch "${RELEASE_BRANCH}"; then
    exit 1
fi
git checkout "${RELEASE_BRANCH}"
git push origin "${RELEASE_BRANCH}"
