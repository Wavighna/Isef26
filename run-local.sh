#!/bin/sh
set -e

PROJECT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
export PATH="$PROJECT_DIR/.tools/node/bin:$PATH"

cd "$PROJECT_DIR"
npm run dev
