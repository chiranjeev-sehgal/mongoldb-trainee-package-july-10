#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
PACKAGE_DIR="$REPO_ROOT/trainee-package"

rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

copy_item() {
  item_name=$1

  case "$item_name" in
    .git|node_modules|instructor|coverage|reports|trainee-package)
      return 0
      ;;
  esac

  cp -R "$REPO_ROOT/$item_name" "$PACKAGE_DIR/$item_name"
}

for item in \
  .env.example \
  .github \
  .gitignore \
  CHALLENGE.md \
  README.md \
  SUBMISSION.md \
  eslint.config.js \
  jest.config.js \
  lib \
  models \
  next-env.d.ts \
  package-lock.json \
  package.json \
  pages \
  scripts \
  tests \
  tsconfig.json
do
  copy_item "$item"
done

printf '%s\n' "$PACKAGE_DIR"
