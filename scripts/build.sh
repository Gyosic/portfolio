#!/bin/bash

set -e

# 1. 기존 dist 폴더 삭제
if [ -d "./dist" ]; then
  echo "기존 dist 폴더 삭제 중..."
  rm -rf ./dist
fi

# 2. Next.js 빌드
echo "Next.js 앱 빌드 중..."
npm run build

# 3. out 디렉토리 구성
echo "dist 폴더 구성 중..."
mkdir -p dist
cp -r .next/standalone/. dist/
cp -r .next/static dist/.next/
cp -r public dist/public

echo "✅ 빌드 완료: ./dist"

tar --no-xattrs cJf portfolio.tar.xz ./dist